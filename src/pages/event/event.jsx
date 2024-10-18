import { Link } from "react-router-dom";
import "./event.css";

const EventCreation = () =>
{
    
    return(
<div>
    <head>
        <link rel="stylesheet" href="event.css"></link>
        <title>Event Management Form</title>
    </head>

<body>
    <div class="container">
        <form id="event-matching-form">
            <div class="form-group">
                <label for="event-name">Event Type:</label>
                <input type="text" id="event-name" name="event-name" maxlength="100"></input>
            </div>

            <div class="form-group">
                <label for="described-event">Description of Event:</label>
                <textarea type="text" id="describe" name="describe"></textarea>
            </div>

            <div class = "form-group">
                <label for="location">Location</label>
                <input type="text" id="locate" name = "location"></input>
            </div>

            <div class = "form-group">
                <label for="skills">Required Skills</label>
                <select id="skills" name = "skills">
                    <option value = "leader">Leadership</option>
                    <option value = "logistic">Logistics</option>
                    <option value = "communication">Communications</option>
                </select>
            </div>

            <div class = "form-group">
                <label for="urgency">Urgency</label>
                <select id="urgency" name = "urgency">
                    <option value = "low">Standard</option>
                    <option value = "medium">Priority</option>
                    <option value = "high">High Priority</option>
                </select>
            </div>
            
            <div>
                <label for="date">Date of Event:</label>
                <input type="date" id="event-date" name="event-date"></input>
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