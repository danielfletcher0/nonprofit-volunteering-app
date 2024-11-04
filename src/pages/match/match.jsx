import React, { useState } from 'react';
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
    const [matchingLoading, setMatchingLoading] = useState(false);

    const fetchVolunteerSuggestions = async (name) => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`http://localhost:4000/match/suggestions/${name}`);
            if (response.ok) {
                const volunteers = await response.json();
                setSuggestions(volunteers.slice(0, 5)); // Show all volunteers
            } else {
                setSuggestions([]);
                setErrorMessage('Error fetching suggestions.');
            }
        } catch (error) {
            console.error("Fetch Error:", error);
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
        setVolunteerName(suggestion.full_name);
        setSuggestions([]);
        setErrorMessage('');

        // Fetch events for the selected volunteer
        try {
            const response = await fetch(`http://localhost:4000/match/events/${suggestion.full_name}`);
            if (response.ok) {
                const events = await response.json();
                // Exclude events already matched to any volunteer
                const availableEvents = events.filter(event => !matchedVolunteers.has(event.event_name));
                setMatchedEvents(availableEvents);

                if (availableEvents.length === 0) {
                    setErrorMessage('No events found for this volunteer.');
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error fetching events: ${errorData.message}`);
                setMatchedEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
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

        // Find the selected event object
        const selectedEventData = matchedEvents.find(event => event.event_id === parseInt(selectedEvent));
        
        if (!selectedEventData) {
            setErrorMessage('Selected event not found.');
            return;
        }

        const confirmMatch = window.confirm(`Are you sure you want to match ${volunteerName} to ${selectedEventData.event_name}?`);
        if (confirmMatch) {
            setMatchingLoading(true);
            setMatchedVolunteers(prev => new Set(prev).add(volunteerName));
            setMatchedEvents(prev => prev.filter(event => event.event_id !== selectedEventData.event_id));
            setSuccessMessage(`${volunteerName} was successfully matched to ${selectedEventData.event_name}!`);
            setIsSuccessVisible(true);

            // Save the match to the backend
            await fetch('http://localhost:4000/match/matched-volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volunteerName, eventId: selectedEventData.event_id })
            });

            // Reset fields
            setVolunteerName('');
            setSelectedEvent('');
            setSuggestions([]);
            setErrorMessage('');
            setMatchingLoading(false);
        }
    };

    const closeSuccessPopup = () => {
        setIsSuccessVisible(false);
    };

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
                        placeholder="Type a name (e.g., Alice, Bob, John Doe)"
                    />
                    {loading && <p>Loading...</p>}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown show">
                            {suggestions.map(suggestion => (
                                <li key={suggestion.vol_id} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion.full_name}
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
                                <option key={event.event_id} value={event.event_id}>
                                    {event.event_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <button 
                        onClick={handleMatchVolunteer} 
                        disabled={isMatchButtonDisabled || matchingLoading}
                    >
                        {matchingLoading ? 'Matching...' : 'Match Volunteer'}
                    </button>
                </div>
            </main>
        </section>
    );
};

export default VolunteerMatching;