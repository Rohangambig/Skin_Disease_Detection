import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

import './index.css';
import profileImage from '../profileImage.png';

const socket = io('http://localhost:2463', { path: '/socket.io' });

const ChatPage = () => {
  const { Id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userData = async () => {
      try {
        const res = await axios.get(`http://localhost:2463/freind/${Id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setUser(res.data);

      } catch (err) {
        console.log('Error in fetching name...', err);
      }
    };
    userData();
  }, [Id]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const api = localStorage.getItem('role') === 'doctor' ? 'http://localhost:2463/message/chats/doctor' : 'http://localhost:2463/message/chats/user';
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        
        if( localStorage.getItem('role') === 'user')
          setDoctors(response.data);
        else 
          setUsers(response.data);

        console.log("User ", users);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    const fetchChatParticipants = async () => {
      try {
        const response = await axios.get(`http://localhost:2463/message/participants/${Id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        const role = localStorage.getItem('role');
        if (role === 'user') {
          setUserId(response.data.userId);
        } else if (role === 'doctor') {
          setDoctorId(response.data.doctorId);
        }
      } catch (error) {
        console.error('Error fetching chat participants:', error);
      }
    };

    const role = localStorage.getItem('role');
    const roomId = role === 'user' ? `${Id}-${userId}` : `${doctorId}-${Id}`;
    if (role === 'user' || role === 'doctor') {
      socket.emit('joinRoom', roomId);
    }

    fetchChatParticipants();
  }, [Id, userId, doctorId]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:2463/message/get/${Id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role')
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

  }, [Id]);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      socket.off('message');
    };
  }, []);
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message,
        timestamp: new Date(),
        sender: userRole,
        doctorId: userRole === 'user' ? Id : doctorId,
        userId: userRole === 'user' ? userId : Id,
      };

      const roomId = userRole === 'user' ? `${Id}-${userId}` : `${doctorId}-${Id}`;
      socket.emit('sendMessage', newMessage, roomId);

      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      try {
        await axios.post('http://localhost:2463/message/send', newMessage, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatElapsedTime = (msDifference) => {
    const seconds = Math.floor(msDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  };

  // useEffect(() => {
  //   socket.on('receiveCall', (data) => {
  //     const acceptCall = window.confirm('You have an incoming video call. Accept?');
  //     if (acceptCall) {
  //       socket.emit('acceptCall', { to: data.from, signal: data.signal });
  //       navigate(`/video-call/${data.from}`); // Navigate to VideoCallPage
  //     }
  //   });
  
  //   return () => {
  //     socket.off('receiveCall');
  //   };
  // }, []);

  // const handleVideoCall = () => {
  //   navigate(`/video-call/${Id}`);
  // };
  

  return (
    <div className="chat-history">
      <ul className="all-chats">

        <form><input type='text' placeholder='Search your friend...' className='freind-input'></input></form>

        {doctors && doctors.map((doctor) => (
          <li key={doctor._id} onClick={() => {navigate(`/chat/${doctor._id}`)}} className={doctor._id === Id ? 'profile-active':''}>
            <img id='profile-image' src={profileImage} alt='profile'></img>
            <Link  className='reciever-link'>{doctor.name}</Link>
          </li>
        ))}
        
        {users && users.map((doctor) => (
          <li key={doctor._id} onClick={() => {navigate(`/chat/${doctor._id}`)}} className={doctor._id === Id ? 'profile-active':''}>
            <img id='profile-image' src='https://winaero.com/blog/wp-content/uploads/2017/12/User-icon-256-blue.png' alt='profile'></img>
            <Link  className='reciever-link'>{doctor.name}</Link>
          </li>
        ))}
      </ul>

      <div className="chat-placeholder">
        <div className='profile-container'>
          <h2>{user.name}</h2>
          <div className='call-menu'>
            <i className='bx bxs-video' onClick={()=>{navigate('/video-call')}}></i>
            <i className='bx bxs-phone-call' ></i>
            <i className='bx bx-dots-vertical-rounded'></i>
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  (userRole === 'user' && msg.sender === 'user') ||
                  (userRole === 'doctor' && msg.sender === 'doctor')
                    ? 'user-message'
                    : 'doctor-message'
                }`}
              >
                <div className="message-content">{msg.message}</div>
                <div className="message-timestamp">
                  {formatElapsedTime(new Date() - new Date(msg.timestamp))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              rows={3}
              style={{ resize: 'none', width: '100%' }}
            />  
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
