import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './singup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:2463/user/doctor-signup', formData);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="card-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="form-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="submit-button">Signup</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/doctor-login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
