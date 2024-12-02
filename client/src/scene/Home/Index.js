import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import axios from 'axios';

import NavigationBar from '../Navigation_bar/Nav';
import Footer from '../Footer/index';
// import SearchContainer from '../Search/Index';
// import Chatbot from '../ChatBot/Index';


import './Index.css';
// import './Recommandation.css';
// import './ImageUpload.css';

import uploadImage from '../allImages/uploadImage.png';
import doctorsImage from '../allImages/doctos.png';
import profileImage from '../profileImage.png';

export default function Index() {
  const navigate = useNavigate();
  const [detectedData, setDetectedData] = useState(null);
  const [allMedicines, setAllMedicines] = useState([]);
  const [alldoctors, setDoctors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [buttonValues,setButtonValues] = useState("Submit");
  const [uploadedImage,setUploadedImage] =  useState(null);
  
 
  const storeData = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type); 
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('image');

    setButtonValues("Loading...");
    
    if (fileInput.files.length > 0) {
      setUploadedImage(fileInput.files[0]);
      formData.append('file', fileInput.files[0]);
      try {
        // First, send the image to detect the disease
        const response = await axios.post('http://localhost:5000/detect', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if(response.data.disease === 'None') {
          alert("No disease found")
          
        }
        setDetectedData(response.data);
        // Now fetch the medicines based on the detected disease
        const res_medicine = await axios.get(`http://localhost:2463/medicines?disease=${response.data.disease}`);
        setAllMedicines(res_medicine.data);
        // setNoDisease(false);
        // Fetch the list of doctors
        const res_doctors = await axios.get('http://localhost:2463/doctors');
        setDoctors(res_doctors.data);
        setButtonValues("Submit");
      } catch (error) {
        console.error('Error uploading file or fetching data:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  // Function to scroll the container
  const scrollContainer1 = (scrollOffset) => {
    document.querySelector('.doctors-list1').scrollLeft += scrollOffset;
  };

  const scrollContainer2 = (scrollOffset) => {
    document.querySelector('.doctors-list2').scrollLeft += scrollOffset;
  };


  const handleCart = async (id) => {
    try {
      const response = await axios.post('http://localhost:2463/medicines/cartProduct',{id},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Role: localStorage.getItem('role'),
        },
      });
      alert("Data stored...");
      
    }catch(err){
      console.log("error in carting the medicine...",err);
    }
  }
  const [state, setState] = useState('idle'); // idle | listening | speaking
    const speechRecognitionRef = useRef(null); // Ref for speech recognition
    const speechSynthesisRef = useRef(window.speechSynthesis);
    const API_URL = 'http://localhost:5000/chatBotData';

    // Start listening
    const handleStartListening = () => {
        if ('webkitSpeechRecognition' in window) {
            speechRecognitionRef.current = new window.webkitSpeechRecognition();
            speechRecognitionRef.current.lang = 'en-US';
            speechRecognitionRef.current.continuous = false;
            speechRecognitionRef.current.interimResults = false;

            speechRecognitionRef.current.onstart = () => {
                console.log('Speech recognition started');
                setState('listening');
            };

            speechRecognitionRef.current.onend = () => {
                console.log('Speech recognition ended');
                setState('idle');
            };

            speechRecognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log(`Recognized: ${transcript}`);
                handleIntermediateResponse(); // Provide feedback before processing
                sendMessageToBackend(transcript);
            };

            speechRecognitionRef.current.start();
        } else {
            alert('Speech Recognition API is not supported in your browser.');
        }
    };

    // Stop listening
    const handleStopListening = () => {
        if (speechRecognitionRef.current) {
            speechRecognitionRef.current.stop();
            setState('idle');
        }
    };

    // Provide intermediate feedback
    const handleIntermediateResponse = () => {
        const utterance = new SpeechSynthesisUtterance("Wait a second...");
        speechSynthesisRef.current.speak(utterance);
        setState('speaking');

        utterance.onend = () => {
            setState('idle');
        };
    };

    // Send recognized message to the backend
    const sendMessageToBackend = (message) => {
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        };

        fetch(API_URL, request)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response) {
                    console.log(`Bot Response: ${data.response}`);
                    readOutLoud(data.response);
                } else {
                    console.error('No valid response from the backend.');
                }
            })
            .catch((err) => {
                console.error('Error fetching data from backend:', err);
            });
    };

    // Read response out loud
    const readOutLoud = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesisRef.current.speak(utterance);
        setState('speaking');

        utterance.onend = () => {
            setState('idle');
        };
    };

    // Handle button action
    const handleButtonClick = () => {
        if (state === 'idle') {
            handleStartListening();
        } else if (state === 'listening') {
            handleStopListening();
        } else if (state === 'speaking') {
            speechSynthesisRef.current.cancel();
            setState('idle');
        }
    };

    const getButtonIcon = () => {
        if (state === 'idle') return 'bx-microphone'; 
        if (state === 'listening') return 'bx-stop'; 
        if (state === 'speaking') return 'bx-volume-mute'; 
    };

  return (
    <div className='home-container'>
      
      <div className='home'>
        <div className="assistant-controls">
          <button onClick={handleButtonClick} title={getButtonIcon()}>
              <i className={`bx ${getButtonIcon()}`}></i> 
          </button>
        </div>

        <h1>Welcome to Dermiscan...</h1>

        <div className='users-container'>
          <NavigationBar></NavigationBar>

          <div className='take-image'>
            <div className='doctors-medicines'>
              <h2 style={{ position: 'absolute', textAlign: 'center', marginTop: '0px'}}>Your Doctors and Medicines</h2>
              <img src={doctorsImage} alt='doctorImage' id='doctorImage' />

              <div className='doctorsList'>
                <div className='appoitedDoctors' onClick={() => { navigate('doctors') }}>
                  <span>Appointment History</span>
                  <p>Find your favourite doctors</p>
                </div>

                <div className='appoitedDoctors' onClick={() => { navigate('medicines') }}>
                  <span>Ordered Medicines</span>
                  <p>Check your order Details</p>
                </div>  
              </div>
            </div>

            <div className='upload-image'>
                {detectedData && (
                  <div className='image-details'>
                      <div>
                        <h2>Detected disease ..</h2>
                        <p><strong>Disease</strong> : {detectedData.disease}</p>
                        <p><strong>Medicine</strong> : {detectedData.medicine}</p>
                        <p><strong>Accuracy</strong> : {detectedData.accuracy}</p>
                      </div>
                  </div>
                )}

              <form onSubmit={handleSubmit} className="image-upload-form">
                <div>
                  <label htmlFor="image" className="image-upload-label">
                    <img
                      src={
                        uploadedImage
                          ? URL.createObjectURL(uploadedImage)
                          : uploadImage 
                      }
                      alt="Uploaded"
                      className="uploaded-image-preview"
                    />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <button type="submit">{buttonValues}</button>
              </form>
            </div>
          </div>
        </div>
        {allMedicines.length > 0 && ( <h1 style={{ marginTop: '50px' }}>Recommended medicines and Doctors</h1> )}
        
        <div className='doctor-recommandation'>
          <div className='mobile-container'>
            {selectedItem && selectedType === 'medicine' && (
              <div className='text-content'>
                <img style={{ width: '80%', borderRadius: '50%' }} src={selectedItem.photo} alt='profile' />
                <p><strong>Name:</strong> {selectedItem.medicine_name}</p>
                <p><strong>Description:</strong> {selectedItem.description}</p>
                <p><strong>About Medicine:</strong> {selectedItem.about || "No additional information available."}</p>
                <div style={{'display':'flex','gap':'10px'}}>
                    <button className='cart_button' onClick={()=>{handleCart(selectedItem._id)}}>Add to Cart</button>
                    <button className='cart_button'>Buy Now</button>
                </div>
              </div>
            )}

            {selectedItem && selectedType === 'doctor' && (
              <div className='text-content'>
                <img src={selectedItem.photo ? profileImage : selectedItem.photo} alt='profile' style={{ width: '40%',  }} />
                <h2>{selectedItem.name}</h2>
                <p><strong>Specialization:</strong> {selectedItem.specialization}</p>
                <p><strong>Clinic:</strong> {selectedItem.clinic}</p>
                <p><strong>Location:</strong> {selectedItem.location}</p>
                <p><strong>Ratings:</strong> {selectedItem.ratings}</p>
                <div style={{'display':'flex','gap':'20px'}}>
                    <button className='cart_button'  onClick={()=> {navigate(`/chat/${selectedItem._id}`)}}>Chat</button>
                    <button className='cart_button' onClick={()=> {navigate(`/appointment/${selectedItem._id}`)}}>Appointment</button>
                </div>
              </div>
            )}

            {!selectedItem && allMedicines.length > 0 && (
              <div className='text-content'>
                <h1>Welcome to DermiScan</h1>
                "Discover the future of healthcare with our cutting-edge mobile app, designed to bring personalized doctor recommendations right to your fingertips. Our app empowers you to make informed decisions, manage appointments, and receive tailored health advice anytime, anywhere. Join thousands of users who trust us to support their wellness journey!"   
              </div>
            )}

          </div>

          <div className='medicine-container'>
          {allMedicines.length > 0 && (
            <div className="scroll-container">
              <button className="scroll-button" onClick={() => scrollContainer1(-100)}>&lt;</button>
              <div className="doctors-list1">
                <ul>
                  {allMedicines.map((medicine, index) => (
                    <li key={index} onClick={() => storeData(medicine, 'medicine')}>
                      <img src={medicine.photo} alt='profile' />
                      <div className='about-medicine'>
                        <p><strong>Medicine Name</strong>: {medicine.medicine_name}</p>
                        <p><strong>About Medicine</strong>: {medicine.description}</p>
                        <div>
                          <button className='cart_button' onClick={()=>{handleCart(medicine._id)}}>Add to Cart</button>
                          <button className='cart_button'>Buy</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="scroll-button" onClick={() => scrollContainer1(100)}>&gt;</button>
            </div>
          )}
          

            {alldoctors.length > 0 && (
              <div className="scroll-container">
                <button className="scroll-button" onClick={() => scrollContainer2(-100)}>&lt;</button>
                <div className='doctors-list2'>

                <ul>
                  {alldoctors.map((doctor, index) => (
                    <li key={index} onClick={() => storeData(doctor, 'doctor')}>
                      <img src={profileImage} alt='profile' />
                      <div className='about-medicine'>
                        <h2>{doctor.name}</h2>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Clinic:</strong> {doctor.clinic}</p>
                        <p><strong>Location:</strong> {doctor.location}</p>
                        <p><strong>Ratings:</strong> {doctor.ratings}</p>

                        <div>
                          <button className='cart_button' onClick={()=> {navigate(`/chat/${doctor._id}`)}}>Chat</button>
                          <button className='cart_button'  onClick={()=> {navigate(`/appointment/${doctor._id}`)}}>Appointment</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="scroll-button" onClick={() => scrollContainer2(100)}>&gt;</button>
            </div>
            )}
          </div>
          
        </div>
          
        {allMedicines.length > 0 && (<Footer></Footer>)}

      </div>

    </div>
  )
};
