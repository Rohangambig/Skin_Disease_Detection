const User = require('../models/User');
const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  console.log('hit');
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, "something");
    res.status(200).json({ token, userId: user._id, message: 'User login successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Doctor Login
exports.doctorLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const doctor = await Doctor.findOne({ name });

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // hashed one... update it
    
    // const isMatch = await bcrypt.compare(password, doctor.password);

    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    const token = jwt.sign({ id: doctor._id }, "something");
    res.json({ token, message: 'Doctor login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Doctor Signup
exports.doctorSignup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({
      username,
      email,
      password: hashedPassword,
      // specialization: "Pediatrician", // You can also take this as input
      // clinic: "KidsCare Clinic", // You can also take this as input
      // location: "Chicago", // You can also take this as input
      // ratings: 4.7, // Default value, you can also make this dynamic
      // photo: "sarah_johnson.jpg", // Placeholder, ensure this is correct
      // available: true, // Default value, you can make this dynamic too
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.log("Error in doctor data store");
    res.status(400).json({ error: error.message });
  }
};
