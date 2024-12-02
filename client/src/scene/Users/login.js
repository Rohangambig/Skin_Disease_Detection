import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [errors, setErrors] = useState("");
  const [buttonValue, setButtonValue] = useState("Submit");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonValue("Loading..");

    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:2463/user/login', formData);
        localStorage.setItem('token', response.data.token);
        console.log(response.data.token)
        localStorage.setItem('role', 'user');
        navigate('/home');
      } catch (error) {
        setButtonValue("Submit");
        setErrors("Invalid username or password");
        console.error(error);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="login-input"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="submit"
            className="login-button"
            value={buttonValue}
          />
        </form>
        {errors && <p className="error-message">{errors}</p>}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup" className="signup-link-text">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;