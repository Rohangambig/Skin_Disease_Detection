import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import axios from "axios";
import "./Index.css";

const AppointmentHistory = () => {
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [doctorNames, setDoctorNames] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        const fetchAppointmentHistory = async () => {
            try {
                const response = await axios.get("http://localhost:2463/doctors/history", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        Role: localStorage.getItem("role"),
                    },
                });
                setAppointmentHistory(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error in fetching appointment history:", err);
                setError("Failed to fetch appointment history.");
                setIsLoading(false);
            }
        };

        fetchAppointmentHistory();
    }, [trigger]);

    useEffect(() => {
        // Fetch doctor names for all appointments
        const fetchDoctorNames = async () => {
            const doctorMap = {};
            for (const appointment of appointmentHistory) {
                const doctorId = appointment.doctorId;
                if (!doctorMap[doctorId]) {
                    try {
                        const response = await axios.get(`http://localhost:2463/doctors/${doctorId}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                Role: localStorage.getItem("role"),
                            },
                        });
                        doctorMap[doctorId] = response.data.name; // Assuming the response has the name field
                    } catch (err) {
                        console.error(`Error fetching doctor with ID ${doctorId}:`, err);
                    }
                }
            }
            setDoctorNames(doctorMap);
        };

        if (appointmentHistory.length > 0) {
            fetchDoctorNames();
        }
    }, [appointmentHistory]);

    const handleRemoveAppointment = async (id) => {
        try {
            console.log(id)
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
            setTrigger((prev) => !prev);
        } catch (err) {
            console.log("Error in removing the appointment:", err);
        }
    };

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <Activity className="loading-icon" />
                <p>Loading appointments...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="appointment-container">
            <h1 className="page-title">
                <span className="title-icon">📅</span>
                Appointment History
            </h1>

            {appointmentHistory.length > 0 ? (
                <div className="appointment-grid">
                    {appointmentHistory.map((item, index) => (
                        <div
                            key={index}
                            className="appointment-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="card-header">
                                <h3>Dr. {doctorNames[item.doctorId] || "Loading..."}</h3> {/* Display doctor's name */}
                                <span className="appointment-date">{formatDate(item.date)}</span>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="info-label">Time:</span>
                                    <span className="info-value">{item.time}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{item.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Phone:</span>
                                    <span className="info-value">{item.phone}</span>
                                </div>
                            </div>
                            <div className="card-status">
                                <span className="status-badge">Completed</span>
                                <span
                                    className="cancel-badge"
                                    onClick={() => handleRemoveAppointment(item._id)}
                                >
                                    Cancel
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-appointments">
                    <img
                        src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                        alt="No appointments"
                        className="empty-state-image"
                    />
                    <p>No appointment history found.</p>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;
