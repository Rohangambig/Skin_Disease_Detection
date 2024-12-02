import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './Index.css';

export default function Index() {
    const [detectedData, setDetectedData] = useState(null); 
    const [allMedicines, setAllMedicines] = useState([]);
    const [alldoctors, setDoctors] = useState([]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      const fileInput = document.getElementById('image');
  
      if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]); 
        try {
          // First, send the image to detect the disease
          const response = await axios.post('http://192.168.23.116:5000/detect', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setDetectedData(response.data); 
          
          // Now fetch the medicines based on the detected disease
          const res_medicine = await axios.get(`http://192.168.23.116:2463/medicines?disease=${response.data.disease}`);
          setAllMedicines(res_medicine.data); 
          console.log('Doctors:', allMedicines);
  
          // Fetch the list of doctors
          const res_doctors = await axios.get('http://192.168.23.116:2463/doctors');
          setDoctors(res_doctors.data); 
  
        } catch (error) {
          console.error('Error uploading file or fetching data:', error);
        }
      } else {
        console.error('No file selected');
      }
    };

    const handleCart = async (productID) =>{

      const result = await axios.get(`http://192.168.23.116:2463/medicines/cart/${productID}`).then(()=>{
        console.log(result.data);
      }).catch(err => {
        console.log(err);
      })

    }
  
    return (
      <div  className='disease-container'>
        <h1>Upload your image here...</h1>
        <div className='image-upload-container'>
          <form onSubmit={handleSubmit} className='image-upload-form'>
              <input type="file" name="image" id="image" />
              <button type="submit">Submit</button>
          </form>

          
          {detectedData && (
          <div>
              <h2>Detected Data</h2>
              <p><strong>Disease:</strong> {detectedData.disease}</p>
              <p><strong>Accuracy:</strong> {detectedData.accuracy}%</p>
              <p><strong>Recommended Medicine:</strong> {detectedData.medicine}</p>
          </div>
          )}

        </div>
          
        { allMedicines.length > 0 && (
          <div className='suggested-headings'>
            <h1>Suggested Medicine</h1>
            <h1>Suggested Doctors</h1>
          </div>
        )
        }
      </div>
    );
  }
  
  
  