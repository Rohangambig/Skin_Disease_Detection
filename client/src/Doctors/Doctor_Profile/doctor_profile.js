import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Index.css';
import profileImage from '../profileImage.png';

const DoctorProfile = () => {
  const [doctors, setDoctors] = useState({});
  const [trigger, setTrigger] = useState(false);
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  // Fetching doctor details and appointments when the component mounts
  useEffect(() => {
    const fetchDetailsAndAppointments = async () => {
      try {
        // Fetch doctor details
        const doctorRes = await axios.get("http://localhost:2463/doctors/Details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setDoctors(doctorRes.data.data);

        const appointmentsRes = await axios.get("http://localhost:2463/doctors/appoitmentHistory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setAppointments(appointmentsRes.data.appointments);

      } catch (err) {
        console.log("Error fetching doctor details or appointments : ", err);
      }
    };

    fetchDetailsAndAppointments();
  }, [trigger]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    console.log('Selected date:', newDate);
  };

  const handleRemoveAppointment = async (id) => {
    try {
      await axios.post(
        "http://localhost:2463/doctors/removeAppointment",
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Role: localStorage.getItem("role"),
          },
        }
      );
      window.location.reload();
      setTrigger((prev) => !prev);
    } catch (err) {
      console.log("Error in removing the appointment:", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role');
    navigate('/')
  }

  return (
    <div className="doctor-dashboard">
      <aside className="sidebar">
        <div className="profile-container">
          <img className="profile-image" src={profileImage} alt="Doctor profile" />
          <h2 className="doctor-name">{doctors.name || 'Dr. John Doe'}</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="#" className="active">Dashboard</Link></li>
            <li><Link to='/doctor-interface'>Chat</Link></li>
            <li><Link to="/all-patient">Patients</Link></li>
            <li><Link to="#">Settings</Link></li>
            <li  onClick={handleLogout}><Link>Logout</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Welcome to Dermi Scan</h1>
          <div className="header-actions">
            <button className="btn-notification">
              <i className="bx bx-bell" id='icon-bell'></i>
              <span className="notification-badge">3</span>
            </button>
            <button className="btn-profile">
              <img src={profileImage} alt="Profile" className="profile-thumb" />
            </button>
          </div>
        </header>
        <div className="dashboard-content">
          <section className="calendar-section">
            <h2>Appointment Calendar</h2>
            <Calendar onChange={handleDateChange} value={date} className="custom-calendar" />
          </section>
          <section className="appointments-section">
            <h2>Upcoming Appointments</h2>
            <div className="appointment-list">
              {appointments.length === 0 ? (
                <p className="no-appointments">No appointments scheduled.</p>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="appointment-item">
                    <img alt='person' id='person-image' src={profileImage}></img>
                    <div style={{ 'width': '100%' }} onClick={() => { navigate(`/chat/${apt._id}`)}}>
                      <div className='appoitment-person'>
                        <span className="appointment-time">{apt.name}</span>
                        <span className="appointment-name">{apt.email}</span>
                      </div>
                      <div className='appoitment-person'>
                        <span className="appointment-name">{apt.time}</span>
                        <span className="appointment-name">
                          {new Date(apt.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => { handleRemoveAppointment(apt._id); }} className='remove-cart-button'><i className='bx bx-x'></i></button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
