import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Main from './components/DashBoard';
import Boards from './pages/Boards';
import Tasks from './pages/Tasks';
import ChatPage from './pages/ChatPage';
import SignUp from './components/apis/SignUp';
import LandingPage from './pages/LandingPage/LandingPage';
import PassRecoveryPage from './pages/PassRecoveryPage';
import NotFoundPage from './pages/404';
import TaskForm from './components/Tasks/TaskForm';
import AuthRoute from './components/routes/AuthRoute';

// Component responsible for defining the application's routes
const RoutesComponent = () => {
  return (
      <Routes>
        {/* Route for the landing page */}
        <Route path='/' element={<LandingPage />} />
        {/* Route for the signup page */}
        <Route path="/signup" element={<SignUp />} />
        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        {/* Authenticated route for the main dashboard */}
        <Route path="/main" element={<AuthRoute element={<Main />} />} />
        {/* Authenticated route for the boards page */}
        <Route path="/main/boards" element={<AuthRoute element={<Boards />} />} />
        {/* Redirect from '/boards' to '/main/boards' */}
        <Route path="/boards" element={<Navigate replace to="/main/boards"/>}/>
        {/* Authenticated route for the tasks page */}
        <Route path="/main/tasks" element={<AuthRoute element={<Tasks />} />} />
        {/* Redirect from '/tasks' to '/main/tasks' */}
        <Route path="/tasks" element={<Navigate replace to="/main/tasks"/>}/>
        {/* Authenticated route for the chat page */}
        <Route path="/main/chat" element={<AuthRoute element={<ChatPage />} />} />
        {/* Redirect from '/chat' to '/main/chat' */}
        <Route path="/chat" element={<Navigate replace to="/main/chat"/>}/>
        {/* Route for the 404 not found page */}
        <Route path="/404" element={<NotFoundPage />} />
        {/* Wildcard route redirects to 404 page */}
        <Route path="*" element={<Navigate replace to="/404" />} />
        {/* Authenticated route for creating a new task */}
        <Route path="/main/task/create" element={<AuthRoute element={<TaskForm />} />} />
        {/* Redirect from '/task/create' to '/main/task/create' */}
        <Route path="/task/create" element={<Navigate replace to="/main/task/create"/>} />
        {/* Route for the password recovery page */}
        <Route path="/passwordrecovery" element={<PassRecoveryPage />} />
      </Routes>
  );
};

export default RoutesComponent;
