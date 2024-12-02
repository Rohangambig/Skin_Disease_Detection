import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Index.css';

import profileImage from '../profileImage.png';

const ChatHistory = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate =  useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:2463/message/chats/user', {

          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.log('hit')
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div className="chat-history">
        <ul className='all-chats'>
          <form><input type='text' placeholder='Search your friend...' className='freind-input'></input></form>

          {doctors.map((doctor) => (
            <li key={doctor._id} onClick={() => {navigate(`/chat/${doctor._id}`)}}>
              <img id='profile-image' src={profileImage} alt='profile'></img>
              <Link className='reciever-link'>{doctor.name}</Link>
            </li>
          ))}
        </ul>
        <div className="chat-placeholder">
          <div className='chat-headings'>Chat with Doctors</div>
          <div className='chat-background'></div>
        </div>
      </div>
  );
};

export default ChatHistory;
