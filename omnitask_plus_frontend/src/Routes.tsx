import { Route, Routes } from 'react-router-dom'; // Replace 'Switch' with 'Routes'
import Boards from './pages/Boards';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import Main from './components/Main';

const RoutesComponent = () => {
  return (
      <Routes> {/* Replace 'Switch' with 'Routes' */}
        <Route path="*" element={<Main />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/boards" element={<Boards />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
  );
};

export default RoutesComponent;
