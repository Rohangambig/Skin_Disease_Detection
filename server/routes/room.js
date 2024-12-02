const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const {protect} = require('../middleWare/user');
const router = express.Router();

router.post('/join', protect, async (req, res) => {
    try {
        const { roomId } = req.body;
        const userId = req.user._id.toString();
        console.log('Joining Room - User ID:', userId);

        // Find the room by roomId
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the user is already in the participants list
        const isUserInRoom = room.participants.some((participant) => participant.toString() === userId);
        if (isUserInRoom) {
            return res.status(400).json({ message: 'User already in the room' });
        }

        // Add the user to the participants list
        room.participants.push(req.user._id); // Add the ObjectId directly
        console.log(room)
        await room.save();

        res.status(200).json({ message: 'Joined the room successfully', roomId });
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
    
router.post('/create', protect, async (req, res) => {
    console.log('Incoming request to /create', new Date().toISOString());
    try {
        const roomId = uuidv4();

        const newRoom = new Room({ roomId, participants: [req.user._id] });
        console.log(newRoom)
        await newRoom.save();

        res.status(201).json({ roomId });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
