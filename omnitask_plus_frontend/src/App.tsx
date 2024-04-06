import { BrowserRouter as Router, useLocation } from "react-router-dom";
import RoutesComponent from "./Routes";
import Footer from "./components/Footer";
import NaviBar from "./components/Tasks/NaviBar";
import { ChatProvider } from "./contexts/ChatContext";
// import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const Layout = () => {
  const location = useLocation();


  // Always show the footer except on the LandingPage
  const showFooter = location.pathname !== "/";
  // Exclude the header on the SignUp, Login, and NotFoundPage
  const showHeader = !["/", "/signup", "/login", "/404", "/passwordrecovery"].includes(location.pathname);


  return (
    <>
      {showHeader && <NaviBar />}
      <RoutesComponent />
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>

      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <Layout />
      </div>
    </Router>
  );
}

export default App;
