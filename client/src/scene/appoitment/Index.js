    import React, { useState } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import './Index.css';
    import axios from 'axios';

    const Index = () => {
    const navigate = useNavigate();
    const { doctorID } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('http://localhost:2463/doctors/Bookappoitment', formData, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
            doctorId: doctorID,
            },
        });
        alert('Appointment is done!');
        navigate('/home');
        } catch (err) {
        console.log("Error during taking an appointment...", err);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    

    return (
        <div className='appoiment-container'>
            <form className="appointment-form" onSubmit={handleSubmit}>
            <h2>Book Appointment</h2>
            
            <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-row">
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                />
            </div>
            </div>

            <button id='appoitment-submit-button' type="submit">Book Appointment</button>
        </form>
        </div>
    );
};

    export default Index;