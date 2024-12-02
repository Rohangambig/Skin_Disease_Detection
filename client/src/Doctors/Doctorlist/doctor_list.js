import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:2463/doctor/doctors');
        setDoctors(response.data); 
      } catch (error) {
        console.error('Error fetching doctors:', error);  // Log any errors
      }
    };

    fetchDoctors();  // Call the async function
  }, []);

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <div>
      <h2>Doctors List</h2>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor._id} onClick={() => handleDoctorClick(doctor._id)}>
            {doctor.name} - {doctor.specialization}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
