const Message = require('../models/Message');
const User = require('../models/User');
const Doctor =  require('../models/doctor')

exports.getChatParticipants = async(req, res) => {
  const role = req.role;
  const userId = req.user._id; 
  let chatParticipants;

  console.log('hit')

  if (role === 'user') {
    chatParticipants = { userId };
  } else if (role === 'doctor') {
       chatParticipants = {  doctorId: userId };
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  return res.json(chatParticipants);
};

exports.getMessages = async (req, res) => {
  const { Id: paramId } = req.params; 
  const userId = req.user._id; 
  const role = req.role; // Get the role from the middleware
  
  try {
    let messages;
   

    if (role === 'user') {
      // If the role is user, params will contain doctorId, and userId comes from token
      messages = await Message.find({ doctorId: paramId, userId }).sort({ timestamp: 1 });
    
    } else if (role === 'doctor') {
      // If the role is doctor, params will contain userId, and doctorId comes from token
      const doctorId = req.user._id;
      messages = await Message.find({ doctorId, userId: paramId }).sort({ timestamp: 1 });
      
      
    }
    //console.log(messages);
    // Include both userId and doctorId in the response
    res.json({messages});

  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};


exports.sendMessage = async (req, res) => {
  const { message, sender } = req.body; // Sender is now a general field
  let userId ; // Extracted from JWT token
  const role = req.role; // Get the role from the middleware
  let doctorId;
  // Check the role to determine the appropriate IDs
  if (role === 'user') {
    doctorId = req.body.doctorId; // doctorId comes from the request body for users
    userId = req.user._id; // Use user's ID from the token
  } else if (role === 'doctor') {
    doctorId = req.user._id; // Use doctor's ID from the token
    userId=req.body.userId;
    // console.log(doctorId);
    // console.log(userId);
  }

  try {
    const newMessage = new Message({
      doctorId,
      userId,
      message,
      sender, 
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const doctors = await Message.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$doctorId' } },
      {
        $lookup: {
          from: 'doctors', // Replace 'doctors' with the actual name of your doctors collection
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      { $unwind: '$doctorInfo' }, // Unwind to get doctor info as a single object instead of an array
      {
        $project: {
          _id: 1,
          'doctorInfo.name': 1 // Include only the doctor's name
        }
      }
    ]);

    // Formatting the response to make it cleaner
    const formattedDoctors = doctors.map(doc => ({
      _id: doc._id,
      name: doc.doctorInfo.name
    }));


    res.json(formattedDoctors);

  } catch (error) {
    res.status(500).json({ error: 'Error retrieving chat history' });
  }
};



exports.getDoctorUserChats = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const messages = await Message.find({ doctorId }).populate('userId', 'name');
    const uniqueUsers = [];
    const seenUserIds = new Set();

    messages.forEach((message) => {
      if (!seenUserIds.has(message.userId._id.toString())) {
        seenUserIds.add(message.userId._id.toString());
        uniqueUsers.push(message.userId);
      }
    });

    res.json(uniqueUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users who messaged this doctor" });
  }
};

exports.getUser = async(req,res) => {
 try {
  const _id = req.params.Id;
  const role = req.headers.role

  var user = '';
  if(role === 'doctor')
    user = await User.findById({_id});
  else
    user = await Doctor.findById({_id});

  if(!user)
      return res.status(401).json({message:"Doctor not found"});
  
  return res.status(200).json(user);

 } catch(err) {
  res.status(400).json({message:"doctor not found"})
 }

}