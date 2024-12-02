const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const { getUser } = require('./controllers/message');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',  // Replace with the frontend IP
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/medical', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Error in database connection:", err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  // Joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User with ID ${socket.id} joined room: ${roomId}`);
  });

  // Sending a message to a specific room
  socket.on('sendMessage', (newMessage, roomId) => {
    console.log('Received message:', newMessage, 'in room:', roomId);
    io.to(roomId).emit('message', newMessage); // Emit the message to all in the room
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes setup
app.use('/medicines', require('./routes/medicine'));
app.use('/doctors', require('./routes/doctor'));
app.use('/user', require('./routes/user'));
app.use('/message', require('./routes/message'));
app.use('/freind/:Id', getUser);
app.use('/room', require('./routes/room'));


// Use server.listen instead of app.listen
server.listen(2463,() => {
  console.log('Server and Socket.IO running on port 2463');
});
