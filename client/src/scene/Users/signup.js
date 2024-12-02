import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState("");
  const [buttonValue, setButtonValue] = useState("Sign Up");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonValue("Loading...");

    
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:2463/user/signup', formData);
        navigate('/login');
      } catch (error) {
        setButtonValue("Sign Up");
        setErrors("Signup failed. Please try again.");
        console.error(error);
      }
    }, 1000);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="card-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="submit"
            className="submit-button"
            value={buttonValue}
          />
        </form>
        {errors && <p className="error-message">{errors}</p>}
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;