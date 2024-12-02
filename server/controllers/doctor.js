const appoitment = require('../models/appoitment');
const Appointment = require('../models/appoitment'); 
const Doctor = require('../models/doctor');

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({});  // Assuming Doctor is a mongoose model
        // Send the response and return to ensure no further code is executed
        return res.status(200).json(doctors); 
    } catch (error) {
        // Send an error response if an exception occurs
        return res.status(500).json({ message: 'Error fetching doctors', error });
    }
};



// Fetch all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching doctors list' });
  }
};

// Fetch a doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching doctor profile' });
  }
};

// Create a new doctor
exports.createDoctor = async (req, res) => {
  const { name, specialization, clinic, location, email, password, phoneNumber, ratings } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

    const newDoctor = new Doctor({
      name,
      specialization,
      clinic,
      location,
      email,
      password,
      phoneNumber,
      ratings,
    });

    await newDoctor.save();
    return res.status(201).json(newDoctor);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating doctor' });
  }
};

// Update a doctor by ID
exports.updateDoctor = async (req, res) => {
  const { name, specialization, clinic, location, email, password, phoneNumber, ratings } = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
      name, specialization, clinic, location, email, password, phoneNumber, ratings
    }, { new: true });
    
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating doctor' });
  }
};

// Delete a doctor by ID
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting doctor' });
  }
};

exports.getDoctorDetails = async (req, res) => {
  try {

    const userId = req.user;
    const user = await Doctor.findById(userId);
    if(!user)
      return res.status(401).json({message:'doctor not found'});

    return res.status(200).json({ message: "Doctor data fetched successfully", data: user});
  } catch (err) {
    console.error("Error in fetching the doctors data");
    return res.status(403).json({ message: "Error in fetching doctor details" });
  }
};

exports.createAppointment = async (req, res) => {
  const { name, email, phone, date, time } = req.body;
  const userId = req.user._id;  // Get userId from headers
  const doctorId = req.headers.doctorid;
  console.log(req.headers)

  console.log(req.headers);  // Log all headers to verify doctorId is coming through

  try {
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date,
      time,
      userId,
      doctorId
    });

    console.log(newAppointment);

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment // Return the appointment data
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating appointment",
      error: err.message
    });
  }
};


exports.fetchAppoitmentHistory =  async (req, res) => {
  const userId = req.user._id
  console.log(userId)
  try {
    // Fetch appointments for the user
    const appointments = await Appointment.find({ userId });

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointment history found." });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointment history", error: err.message });
  }
};


exports.removeAppoitment = async (req, res) => {
  const { id } = req.body; 
  try {
    const result = await Appointment.deleteOne({_id:id});
    console.log(result)
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }
    res.status(200).json({ message: "Item has been removed from the cart" });
  } catch (err) {
    console.error("Error during removal:");
    res.status(500).json({ message: "Error removing the cart item" });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id; // Assuming `req.user` is populated by your middleware
    console.log('Doctor ID from middleware:', doctorId); // Debugging log

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const appointments = await Appointment.find({ doctorId })

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this doctor.' });
    }

    res.status(200).json({
      message: 'Appointments fetched successfully',
      appointments,
    });
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

