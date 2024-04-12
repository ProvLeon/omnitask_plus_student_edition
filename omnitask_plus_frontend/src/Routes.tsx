import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Main from './components/DashBoard';
import Boards from './pages/Boards';
import Tasks from './pages/Tasks';
import ChatPage from './pages/ChatPage';
import SignUp from './components/apis/SignUp'; // Added import for SignUp
import LandingPage from './pages/LandingPage/LandingPage'; // Added import for LandingPage
import PassRecoveryPage from './pages/PassRecoveryPage';
import NotFoundPage from './pages/404';
import TaskForm from './components/Tasks/TaskForm';
import AuthRoute from './components/routes/AuthRoute'; // Import the AuthRoute component

const RoutesComponent = () => {
  return (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<AuthRoute element={<Main />} />} />
        <Route path="/main/boards" element={<AuthRoute element={<Boards />} />} />
        <Route path="/boards" element={<Navigate replace to="/main/boards"/>}/>
        <Route path="/main/tasks" element={<AuthRoute element={<Tasks />} />} />
        <Route path="/tasks" element={<Navigate replace to="/main/tasks"/>}/>
        <Route path="/main/chat" element={<AuthRoute element={<ChatPage />} />} />
        <Route path="/chat" element={<Navigate replace to="/main/chat"/>}/>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
        <Route path="/main/task/create" element={<AuthRoute element={<TaskForm />} />} />
        <Route path="/task/create" element={<Navigate replace to="/main/task/create"/>} />
        <Route path="/passwordrecovery" element={<PassRecoveryPage />} />
        {/* Define other routes as needed */}
      </Routes>
  );
};

export default RoutesComponent;
