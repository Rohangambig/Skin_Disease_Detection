import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function Form() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const dataSubmit = !isLogin
      ? { 
          name: formData.get('name'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          emailID: formData.get('emailID'),
          password: formData.get('password'),
        }
      : {
          emailID: formData.get('emailID'),
          password: formData.get('password'),
        };
    
    const url = isLogin ? 'http://localhost:2463/user/login' : 'http://localhost:2463/user/register';
    await axios.post(url,dataSubmit).then(res =>{
        if(isLogin) 
        {
          console.log(res);
          localStorage.setItem('token',res.data.token);
          navigate('/');
        }
        else
          setIsLogin(true);
    }).catch(err => {
        console.log(err,'Error in storing the data');
    })
    
  };

  return (
    <div>
      <div className="background"></div>

      {isLogin && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="toggle-login">
            <span onClick={() => setIsLogin(true)} className="active">
              Login
            </span>
            <span onClick={() => setIsLogin(false)}>Signup</span>
          </div>
          <label htmlFor="emailId">Email ID</label>
          <input type="text" placeholder="Enter your email" id="email" name="emailID" required/>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" name="password" required />
          <button type="submit">Submit</button>
        </form>
      )}

      {!isLogin && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="toggle-login">
            <span onClick={() => setIsLogin(true)}>Login</span>
            <span onClick={() => setIsLogin(false)} className="active">
              Signup
            </span>
          </div>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Enter your name" id="name" name="name" required />
          <label htmlFor="phone">Phone Number</label>
          <input type="text" placeholder="Enter your phone number" id="phone" name="phone" required/>
          <label htmlFor="address">Address</label>
          <input type="text" placeholder="Enter your address" id="address" name="address" required/>
          <label htmlFor="emailId">Email ID</label>
          <input type="text" placeholder="Enter your email" id="email" name="emailID" required/>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" name="password" required/>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
