import React, { useEffect, useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';

import './index.css';
import profileImage from '../profileImage.png'

const DoctorChatHistory = () => {
  const [users, setUsers] = useState([]);
  const navigate =  useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:2463/message/chats/doctor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setUsers(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching chat history for doctor:', error);
      }
    };

    fetchChatHistory();
  }, []);

  return (

    <div className="chat-history">
        <ul className='all-chats'>
          <form><input type='text' placeholder='Search your friend...' className='freind-input'></input></form>

          {users.map((doctor) => (
            <li key={doctor._id} onClick={() => {navigate(`/chat/${doctor._id}`)}}>
              <img id='profile-image' src={profileImage} alt='profile'></img>
              <Link className='reciever-link'>{doctor.name}</Link>
            </li>
          ))}
        </ul>
        <div className="chat-placeholder">
          <div className='chat-headings'>Chat with Patient</div>
          <div className='chat-background'></div>
        </div>
      </div>
     
  );
};

export default DoctorChatHistory;
