import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './scene/Users/login';
import Signup from './scene/Users/signup';
import DoctorLogin from './Doctors/Login/doctor-login';
import DoctorList  from './Doctors/Doctorlist/doctor_list';
import DoctorProfile from './Doctors/Doctor_Profile/doctor_profile';
import ChatHistory from './scene/Chat_History/Index';
import DoctorChatHistory from './Doctors/Doctor_chat_history/doctor-interface';
import Home from './scene/Home/Index';
import FirstPage from '../src/scene/First_Page/Index';
import DoctorSignup  from '../src/Doctors/Login/signup';
import ChatPage from '../src/scene/Chats/Index';
import VideoCallPage from '../src/scene/VideoCall/Index';
import ChatBot from './scene/ChatBot/Index';
import Cart from './scene/cart/Index';
import Appoitment from './scene/appoitment/Index';
import AppoitmentHistory from './scene/AppoimentHistory/Index';
import AllPatient from './Doctors/AllPatient/Index';
import Rooms from './scene/videoRooms/Index';

function App() {
  return (
      <Router>
        <Routes>
          <Route  path='/home' element={<Home></Home>}></Route>
          <Route  path='/' element={<FirstPage></FirstPage>}></Route>
          <Route path='/login' element={<Login></Login>}></Route> 
          <Route path='/signup' element={<Signup></Signup>}></Route> 
          <Route path='/doctor-signup' element={<DoctorSignup></DoctorSignup>}></Route>
          <Route path='/doctor-login' element={<DoctorLogin></DoctorLogin>}></Route>
          <Route path='/doctors' element={<DoctorList></DoctorList>}></Route> 
          <Route path='/doctor-profile' element={<DoctorProfile></DoctorProfile>}></Route>
          <Route path='/chat/:Id' element={<ChatPage></ChatPage>}></Route>
          <Route path='/chat-bot' element={<ChatBot></ChatBot>}></Route>
          <Route path='/home/medicines'  element={<Cart></Cart>}></Route>
          <Route path='/chats' element={<ChatHistory></ChatHistory> } ></Route>
          <Route path="/video-call" element={<VideoCallPage></VideoCallPage>} />
          <Route path='/doctor-interface' element={<DoctorChatHistory></DoctorChatHistory>}></Route>
          <Route path='/appointment/:doctorID' element={<Appoitment></Appoitment>}></Route>
          <Route path='/home/doctors' element={<AppoitmentHistory></AppoitmentHistory>}></Route>
          <Route path='/all-patient' element={<AllPatient></AllPatient>}></Route>
          <Route path='/room/:roomId' element={<Rooms></Rooms>}></Route>
        </Routes>
      </Router>

  );
}

export default App;
