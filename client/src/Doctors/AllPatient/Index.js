import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Index.css';
import { useNavigate } from 'react-router-dom';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate  = useNavigate();
    
    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (!token || !role) {
                throw new Error('Authentication credentials missing');
            }

            const response = await axios.get("http://localhost:2463/doctors/appoitmentHistory", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Role: role,
                },
            });

            setAppointments(response.data.appointments || []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch appointments';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);
    
    const handleRemoveAppointment = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (!token || !role) {
                throw new Error('Authentication credentials missing');
            }

            await axios.post(
                "http://localhost:2463/doctors/removeAppointment",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Role: role,
                    },
                }
            );
            
            toast.success('Appointment cancelled successfully');
            fetchAppointments();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel appointment';
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="patient-portal">
                <div className="patient-loader">
                    <div className="patient-loader__spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="patient-portal">
                <div className="patient-error">
                    <p>Error: {error}</p>
                    <button 
                        className="patient-error__btn"
                        onClick={fetchAppointments}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-portal">
            <h1 className="patient-portal__title">Patient Appointments</h1>
            {appointments.length === 0 ? (
                <div className="patient-empty">
                    <p className="patient-empty__text">No appointments scheduled at the moment</p>
                </div>
            ) : (
                <div className="patient-list">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="patient-card">
                            <div className="patient-card__inner">
                                <h2 className="patient-card__name">
                                    {appointment.name || 'Unknown Patient'}
                                    <i className='bx bx-chat' onClick={()=>{ navigate(`/chat/${appointment._id}`)}}></i>
                                </h2>
                                <div className="patient-card__info">

                                    <div className="patient-card__time">
                                        <span className="patient-card__label">Email:</span>
                                        <span className="patient-card__value">
                                            {appointment.email || 'Not specified'}
                                        </span>
                                    </div>

                                    <div className="patient-card__time">
                                        <span className="patient-card__label">Phone :</span>
                                        <span className="patient-card__value">
                                            {appointment.phone || 'Not specified'}
                                        </span>
                                    </div>

                                    <div className="patient-card__date">
                                        <span className="patient-card__label">Date:</span>
                                        <span className="patient-card__value">
                                            {appointment.date ? 
                                                new Date(appointment.date).toLocaleDateString() : 
                                                'Not specified'}
                                        </span>
                                    </div>
                                    <div className="patient-card__time">
                                        <span className="patient-card__label">Time:</span>
                                        <span className="patient-card__value">
                                            {appointment.time || 'Not specified'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    className="patient-card__cancel"
                                    onClick={() => handleRemoveAppointment(appointment._id)}
                                >
                                    Cancel Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}