import { Link } from "react-router-dom";
import "./event.css";
import React, { useState } from 'react';

const EventCreation = () =>
{
    const [formData, setFormData] = useState(
      { name: '', 
        //describe: '', 
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
        console.log(formData)
      };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
      
        if (validateForm()) {
          console.log('Form data:', formData);  // Log the form data before submission
          
          fetch('http://localhost:4000/profile/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(err => {
                console.error('Backend error:', err);
                throw new Error(err.message || 'Failed to create event.');
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('Event created:', data);
            alert('Event created!');
          })
          .catch(error => {
            console.error('Error creating event:', error);
            alert(error.message);
          });
        } else {
          console.error('Form validation failed');
          alert('Event creation failed')
        }
      };

    return(
      /*
      <div class="form-group">
                <label for="described-event">Description of Event:</label>
                <textarea type="text" id="describe" name="describe"></textarea>
            </div> Return in Line 70 later.
            */

<div>
    <head>
        <link rel="stylesheet" href="event.css"></link>
        <title>Event Management Form</title>
    </head>

<body>
    <div class="container">
        <form id="event-matching-form" onSubmit={handleSubmit}>
            <div class="form-group">
                <label for="event-name">Event Type:</label>
                <input onChange={handleInputChange} type="text" id="event-name" name="event-name" maxlength="100"></input>
            </div>

        

            <div class = "form-group">
                <label for="location">Location</label>
                <input onChange={handleInputChange} type="text" id="locate" name = "location"></input>
            </div>

            <div class = "form-group">
                <label for="skills">Required Skills</label>
                <select onChange={handleInputChange} id="skills" name = "skills">
                    <option value = "leader">Leadership</option>
                    <option value = "logistic">Logistics</option>
                    <option value = "communication">Communications</option>
                </select>
            </div>

            <div class = "form-group">
                <label for="urgency">Urgency</label>
                <select onChange={handleInputChange} id="urgency" name = "urgency">
                    <option value = "low">Standard</option>
                    <option value = "medium">Priority</option>
                    <option value = "high">High Priority</option>
                </select>
            </div>
            
            <div>
                <label for="date">Date of Event:</label>
                <input onChange={handleInputChange} type="date" id="event-date" name="event-date"></input>
            </div>

            <div class="form-group">
                <br></br>
                <button type="Submit">Submit Event Form</button>
            </div>

            <div>
                <input type = "Reset"></input>
                <br></br>
                <div id="root"></div>

            </div>
        </form>
    </div>
</body>

</div>

);
}

export default EventCreation;