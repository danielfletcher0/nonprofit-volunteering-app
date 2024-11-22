import { Link } from "react-router-dom";

import React, { useState } from 'react';



const initialStates = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];


const initialSkillsOptions = [
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Communication', label: 'Communication' },
  // Add more skills as needed...
];

function Profile() {
  const [formData, setFormData] = useState({ username: '', fullName: '', address1: '', address2: '', city: '', state: '', zip: '', skills: [], preferences: '', availability: [''], 
});

  const [errors, setErrors] = useState({});
  const [availableSkills, setAvailableSkills] = useState(initialSkillsOptions); // Track available skills

  // Validation for fields
  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName || formData.fullName.length > 50) {newErrors.fullName = 'Required and should be less than 50 characters';}
    if (!formData.address1 || formData.address1.length > 100) {newErrors.address1 = 'Required and should be less than 100 characters';}
    if (formData.address2 && formData.address2.length > 100) {newErrors.address2 = 'Address 2 should be less than 100 characters';}
    if (!formData.city || formData.city.length > 100) {newErrors.city = 'Required and should be less than 100 characters';}
    if (!formData.state) {newErrors.state = 'Required';}
    if (!formData.zip || formData.zip.length < 5 || formData.zip.length > 9) {newErrors.zip = 'Zip code must be at least 5 characters and no more than 9 characters';}
    if (formData.skills.length === 0) {newErrors.skills = 'At least one skill must be selected';}
    if (formData.availability.length === 0 || formData.availability.some(date => !date)) {newErrors.availability = 'Please select at least one available date';}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const newlySelectedSkill = selectedOptions[selectedOptions.length - 1]; 
    const updatedSkills = [...formData.skills, newlySelectedSkill];

    // Update formData with the new selected skills
    setFormData({
      ...formData,
      skills: updatedSkills,
    });

    // Remove the selected skill from availableSkills
    setAvailableSkills(availableSkills.filter(skill => !updatedSkills.includes(skill.value)));
  };

  const handleRemoveSkill = (skillToRemove) => {
    // Remove the skill from the selected skills
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);

    // Update formData with the new skills
    setFormData({
      ...formData,
      skills: updatedSkills,
    });

    // Add the removed skill back to availableSkills
    const removedSkillObject = initialSkillsOptions.find(skill => skill.value === skillToRemove);
    setAvailableSkills([...availableSkills, removedSkillObject]);
  };

  const handleDateChange = (index, e) => {
    const newDates = [...formData.availability];
    newDates[index] = e.target.value;
    setFormData({
      ...formData,
      availability: newDates,
    });
  };

  const addDateInput = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, ''], // Add an empty date string
    });
  };

  const removeDateInput = (index) => {
    const newDates = formData.availability.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      availability: newDates,
    });
  };
 const handleSubmit = (e) => {
  e.preventDefault();  // Prevent the default form submission behavior
  
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
          throw new Error(err.message || 'Failed to submit profile.');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Profile created:', data);
      alert('Profile submitted successfully!');
    })
    .catch(error => {
      console.error('Error submitting profile:', error);
      alert(error.message);
    });
  } else {
    console.error('Form validation failed');
  }
};


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <div className="text-center">
    <h1 className="text-4xl font-bold">Complete Your Profile</h1>
      </div>
        <br></br>
        <br></br>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>
        <div>
            <label className="font-medium">Full Name </label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" maxLength="50" required />
          {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}
        </div>
        <br></br>
        <div>
            <label className="font-medium">Address 1 </label>
          <input type="text" name="address1" value={formData.address1} onChange={handleInputChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            maxLength="100"
            required
          />
          {errors.address1 && <p style={{ color: 'red' }}>{errors.address1}</p>}
        </div>

        <br></br>

        <div>
            <label className="font-medium">Address 2 </label>
          <input type="text" name="address2" value={formData.address2} onChange={handleInputChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            maxLength="100"
          />
          <em> Optional </em>
          {errors.address2 && <p style={{ color: 'red' }}>{errors.address2}</p>}
        </div>

        <br></br>

        <div>
            <label className="font-medium">City </label>
          <input type="text" name="city" value={formData.city} onChange={handleInputChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            maxLength="100"
            required
          />
          {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
        </div>

        <br></br>

        <div>
            <label className="font-medium">State</label>
            <select name="state" value={formData.state} onChange={handleInputChange} 
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              required
            >
              <option value="">Select your state</option>
              {initialStates.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

        <br></br>

        <div>
            <label className="font-medium">Zip Code </label>
          <input type="text" name="zip" value={formData.zip} onChange={handleInputChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            maxLength="9"
            required
          />
          {errors.zip && <p style={{ color: 'red' }}>{errors.zip}</p>}
        </div>

        <br></br>

        <div>
            <label className="font-medium">Skills</label>
          <select name="skills" value={formData.skills} onChange={handleSkillsChange} className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg">
            <option value="">Select a skill</option>
            {availableSkills.map((skill) => (
              <option key={skill.value} value={skill.value}>
                {skill.label}
              </option>
            ))}
          </select>
          {errors.skills && <p style={{ color: 'red' }}>{errors.skills}</p>}

          {/* Show selected skills */}
          <div>
            <ul>
              {formData.skills.map((skill) => (
                <li key={skill}>
                  {skill}<button type="button" onClick={() => handleRemoveSkill(skill)} className="text-white hover:bg-red-500 font-medium">  Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <br></br>

        <div>
            <label className="font-medium">Preferences </label>
          <textarea name="preferences" value={formData.preferences} onChange={handleInputChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"

          />
          <em> Optional </em>
        </div>

        <br></br>

        <div>
  <label className="font-medium">Availability (Select dates)</label>
  {formData.availability.map((date, index) => (
    <div key={index} className="flex items-center space-x-4 mt-2">
      <input
        type="date"
        value={date}
        onChange={(e) => handleDateChange(index, e)}
        className="w-full px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
      />
      {formData.availability.length > 1 && (
        <button
          type="button"
          onClick={() => removeDateInput(index)}
          className="text-red-600 hover:text-red-500 font-medium"
        >
          Remove
        </button>
      )}
    </div>
  ))}

<button type="button" onClick={addDateInput} className="w-1/4 mt-3 px-3 py-1 text-white font-medium bg-gray-500 hover:bg-gray-400 active:bg-gray-600 rounded-lg duration-150">
  Add Date
</button>

  {errors.availability && <p style={{ color: 'red' }}>{errors.availability}</p>}
</div>


        <br></br>
        <button className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg duration-150">
    Submit Profile
</button>
        </form>
      </div>
  );
}

export default Profile;