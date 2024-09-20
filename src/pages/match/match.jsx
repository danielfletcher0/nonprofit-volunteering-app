import { Link } from "react-router-dom";
import "./match.css";
import React from 'react';

const VolunteerMatching = () => {
    React.useEffect(() => {
        document.getElementById('active-event').value = "None";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const activeEventInput = document.getElementById('active-event');
        const eventSelection = document.getElementById('event-selection');

        activeEventInput.value = eventSelection.options[eventSelection.selectedIndex].text;

        console.log('Form submitted with Active Event:', activeEventInput.value);
        alert('Volunteer matched to: ' + activeEventInput.value);
    };

    return (
        <div className="container">
            <h1>Volunteer Matching Form</h1>
            <form id="volunteer-matching-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="volunteer-name">Volunteer Name:</label>
                    <input type="text" id="volunteer-name" name="volunteer-name" placeholder="John Doe" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="active-event">Active Event:</label>
                    <input type="text" id="active-event" name="active-event" placeholder="None" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="event-selection">Update Event:</label>
                    <select id="event-selection" name="event-selection">
                        <option value="beach-cleanup">Beach Cleanup</option>
                        <option value="food-drive">Food Drive</option>
                        <option value="park-renovation">Park Renovation</option>
                    </select>
                </div>

                <div className="form-group">
                    <button type="submit">Match Volunteer</button>
                </div>
            </form>
        </div>
    );
}

export default VolunteerMatching;
