import { Link } from "react-router-dom";
import "./event.css";
import React, { useState } from 'react';

const EventCreation = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        skill: '',
        urgency: '',
        availability: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:4000/events/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Failed to create event.');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Event created!');
        })
        .catch(error => {
            alert(error.message);
        });
    };

    return (
        <div className="event-container">
            <div className="event-header-container">
                <h1>Create New Event</h1>
            </div>
            <form id="event-matching-form" onSubmit={handleSubmit}>
                <div className="event-form-group">
                    <label htmlFor="event-name">Event Type:</label>
                    <input type="text" onChange={handleInputChange} id="event-name" name="name" maxLength="100" />
                </div>
                <div className="event-form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea 
                        onChange={handleInputChange} 
                        id="description" 
                        name="description" 
                        rows="7"  
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                </div>
                <div className="event-form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" onChange={handleInputChange} id="locate" name="location" />
                </div>
                <div className="event-form-group">
                    <label htmlFor="skills">Required Skills</label>
                    <select onChange={handleInputChange} id="skills" name="skill">
                        <option value="leader">Leadership</option>
                        <option value="logistic">Logistics</option>
                        <option value="communication">Communications</option>
                    </select>
                </div>
                <div className="event-form-group">
                    <label htmlFor="urgency">Urgency</label>
                    <select onChange={handleInputChange} id="urgency" name="urgency">
                        <option value="L">Standard</option>
                        <option value="M">Priority</option>
                        <option value="H">High Priority</option>
                    </select>
                </div>
                <div className="event-form-group">
                    <label htmlFor="date">Date of Event:</label>
                    <input type="date" onChange={handleInputChange} id="event-date" name="availability" />
                </div>
                <div className="event-form-group">
                    <button type="submit">Submit Event Form</button>
                </div>
            </form>
        </div>
    );
};

export default EventCreation;