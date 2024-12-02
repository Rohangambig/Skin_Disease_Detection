import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigate.css';


import ChatBot from '../ChatBot/Index'

export default function Nav() {
  const navigate = useNavigate();
  const [showBot,setshowBot] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/')
  }

  return (
    <div>
      <nav className='navigation-bar'>
        <h1 style={{'marginLeft':'20px'}}>Dermi Scan</h1>
        <ul>
          <li id='active'>Home</li>
          <li onClick={() => {navigate('/chat-bot')} }>Bot</li>
          <li onClick={()=> {navigate('/chats')}}>Chats</li>
          <li>Contact</li>
          <li>About</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
    </div>
  )
}
