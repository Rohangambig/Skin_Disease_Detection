import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Index.css';
import axios from 'axios';

export default function Index() {
    const [meetingId, setMeetingId] = useState('');
    const navigate = useNavigate();
    const handleCreateMeeting = async () => {

      try {

          const token = localStorage.getItem('token'); 
          const response = await axios.post(
              'http://localhost:2463/room/create', 
              {}, 
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      Role:localStorage.getItem('role')
                  },
              }
          );
  
          const newMeetingId = response.data.roomId;
          console.log('Meeting ID:', newMeetingId);
  
          // Navigate to the meeting room
          navigate(`/room/${newMeetingId}`);
        } catch (error) {
          console.error('Error creating meeting:', error);
          alert('Failed to create a meeting. Please try again.');
        }
    };
       

    const [roomId, setRoomId] = useState('');

    const handleJoin = async () => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      try {
        
        console.log(token);
        const response = await axios.post(
          'http://localhost:2463/room/join',
          { roomId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Role:localStorage.getItem('role')
                },
            }
        );
        
        navigate(`/room/${roomId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error joining the room');
    }
  };

    return (
        <div className="video-container">
            <h1 className="title">Video Conferencing</h1>

            <button className="create-btn" onClick={handleCreateMeeting}>
                Create Meeting
            </button>

            <div className="join-section">
            <h2>Join a Meeting</h2>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoin} className='join-btn'>Join Meeting</button>
            </div>
        </div>
    );
}
