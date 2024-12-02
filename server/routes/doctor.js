const express = require('express');
const router = express.Router();
const { protect } = require('../middleWare/user'); 
const doctorController = require('../controllers/doctor');

// Define routes with correct order
router.get('/Details', protect, doctorController.getDoctorDetails);
router.get('/', doctorController.getDoctors);
router.get('/appoitmentHistory',protect,doctorController.getDoctorAppointments)
router.post('/Bookappoitment', protect,doctorController.createAppointment);
router.get('/history', protect,doctorController.fetchAppoitmentHistory);
router.get('/:id', doctorController.getDoctorById);
router.post('/removeAppointment',doctorController.removeAppoitment)

module.exports = router;
