import React, { useState, useEffect } from 'react';
import "./match.css";

const VolunteerMatching = () => {
    const [matchedEvents, setMatchedEvents] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [volunteerName, setVolunteerName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [matchedVolunteers, setMatchedVolunteers] = useState(new Set());
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch matched volunteers when the component mounts
    useEffect(() => {
        const fetchMatchedVolunteers = async () => {
            const response = await fetch('http://localhost:4000/match/matched-volunteers');
            if (response.ok) {
                const data = await response.json();
                const matchedSet = new Set(data.map(match => match.volunteerName));
                setMatchedVolunteers(matchedSet);
            }
        };
        fetchMatchedVolunteers();
    }, []);

    const fetchVolunteerSuggestions = async (name) => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`http://localhost:4000/match/suggestions/${name}`);
            if (response.ok) {
                const volunteers = await response.json();
                const availableVolunteers = volunteers.filter(vol => !matchedVolunteers.has(vol.name));
                setSuggestions(availableVolunteers.slice(0, 5));

                if (availableVolunteers.length === 0) {
                    setErrorMessage('Volunteer not found or unavailable.');
                }
            } else {
                setSuggestions([]);
                setErrorMessage('Error fetching suggestions.');
            }
        } catch (error) {
            setSuggestions([]);
            setErrorMessage('Error fetching suggestions.');
        } finally {
            setLoading(false);
        }
    };

    const handleVolunteerInputChange = (event) => {
        const name = event.target.value;
        setVolunteerName(name);

        if (name) {
            fetchVolunteerSuggestions(name);
        } else {
            setSuggestions([]);
            setErrorMessage('');
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        setVolunteerName(suggestion.name);
        setSuggestions([]);
        setErrorMessage('');

        const response = await fetch(`http://localhost:4000/match/${suggestion.name}`);
        if (response.ok) {
            const events = await response.json();
            setMatchedEvents(events);

            if (events.length === 0) {
                setErrorMessage('No events found for this volunteer.');
            }
        } else {
            setErrorMessage('Error fetching events.');
            setMatchedEvents([]);
        }
    };

    const handleMatchVolunteer = async () => {
        if (!selectedEvent) {
            setErrorMessage('Please select an event to match.');
            return;
        }

        // Check if the volunteer is already matched
        if (matchedVolunteers.has(volunteerName)) {
            setErrorMessage('Volunteer unavailable.');
            return;
        }

        // Check if there are no matched events for the selected volunteer
        if (matchedEvents.length === 0) {
            setErrorMessage('No events matched for this volunteer.');
            return;
        }

        const confirmMatch = window.confirm(`Are you sure you want to match ${volunteerName} to ${selectedEvent}?`);
        if (confirmMatch) {
            setMatchedVolunteers(prev => new Set(prev).add(volunteerName));
            setMatchedEvents(prev => prev.filter(event => event.title !== selectedEvent));
            setSuccessMessage(`${volunteerName} was successfully matched to ${selectedEvent}!`);
            setIsSuccessVisible(true);

            // Save the match to the backend
            await fetch('http://localhost:4000/match/matched-volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volunteerName, eventTitle: selectedEvent })
            });

            setVolunteerName('');
            setSelectedEvent('');
            setSuggestions([]);
            setErrorMessage('');
        }
    };

    const closeSuccessPopup = () => {
        setIsSuccessVisible(false);
    };

    // Determine if the Match Volunteer button should be disabled
    const isMatchButtonDisabled = !volunteerName || !selectedEvent || matchedVolunteers.has(volunteerName);

    return (
        <section className="volunteer-matching container">
            <header style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 className="text-4xl font-bold">Volunteer Matching Form</h1>
            </header>
            <main>
                <div className="form-group">
                    <label htmlFor="volunteer-name">Volunteer Name:</label>
                    <input
                        type="text"
                        id="volunteer-name"
                        value={volunteerName}
                        onChange={handleVolunteerInputChange}
                        placeholder="Type a name (e.g., John Doe, Jane Smith, Alice Johnson)"
                    />
                    {loading && <p>Loading...</p>}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown show">
                            {suggestions.map(suggestion => (
                                <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {isSuccessVisible && (
                    <div className="success-popup">
                        <button className="close-popup" onClick={closeSuccessPopup}>✖</button>
                        <p className="success-message">{successMessage}</p>
                    </div>
                )}

                {matchedEvents.length > 0 && (
                    <div>
                        <label htmlFor="event-selection">Select Event:</label>
                        <select
                            id="event-selection"
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            value={selectedEvent}
                        >
                            <option value="">-- Select an event --</option>
                            {matchedEvents.map(event => (
                                <option key={event.id} value={event.title}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <button 
                        onClick={handleMatchVolunteer} 
                        disabled={isMatchButtonDisabled}
                    >
                        Match Volunteer
                    </button>
                </div>
            </main>
        </section>
    );
};

export default VolunteerMatching;
