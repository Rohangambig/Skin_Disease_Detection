import React from 'react';
import aiBot from '../allImages/bot.png';
import bot from '../allImages/botcopy.png'
import { useNavigate } from 'react-router-dom';
import './Index.css';


export default function Index() {

    const navigate  =  useNavigate();
  return (
    <div className='first-container'>
    <div className='showDesgin'></div>
    <img src={aiBot} alt='bot-image' className='bot-image'></img>
    <img src={bot} alt='doctor-image' className='doctor-image'></img>

        <nav className='nav'>
            <span>Dermi Scan</span>
            <ul>
                <li>Product</li>
                <li>Solutions</li>
                <li>Login</li>
                <li>Signup</li>
            </ul>
        </nav>

        <div className='content-container'>
            <h1>Empowering Health with AI-Driven Skin Disease Detection</h1>

            <p>We leverage advanced AI technology to accurately detect a variety of skin diseases, providing users with instant insights and customized recommendations. Our platform connects you with trusted dermatologists for professional consultations and suggests effective treatments and medications tailored to your skin condition. Start your journey toward healthier skin with confidence and convenience..</p>

            <div className='first-container-button'>
                <button onClick={() => {navigate('/login')}} id='user-login'>User login</button>
                <button onClick={() => {navigate('/doctor-login')}} id='doctor-login'>Doctor Login</button>
            </div>

        </div>

    </div>
  )
}
