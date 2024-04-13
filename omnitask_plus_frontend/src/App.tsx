import { BrowserRouter as Router, useLocation } from "react-router-dom";
import RoutesComponent from "./Routes";
import Footer from "./components/Footer";
import NaviBar from "./components/Tasks/NaviBar";
import { ErrorBoundary } from "./utils/ErrorBoundaryState";

// Layout component that decides when to show the header and footer based on the current route
const Layout = () => {
  const location = useLocation(); // Hook to access the current location object

  // Determine if the footer should be shown. It's hidden on the landing page and specific main pages
  let showFooter = location.pathname !== "/" && !['/main/chat', '/main'].includes(location.pathname);
  // Determine if the header should be shown. It's hidden on the landing, signup, login, 404, and password recovery pages
  const showHeader = !["/", "/signup", "/login", "/404", "/passwordrecovery"].includes(location.pathname);

  return (
    <>
      {/* // Show the navigation bar wrapped in an ErrorBoundary if showHeader is true */}
      {showHeader && <ErrorBoundary><NaviBar /></ErrorBoundary>}
      {/* // Always show the RoutesComponent which contains the application's routes */}
      <RoutesComponent />
      {/* // Show the footer if showFooter is true */}
      {showFooter && <Footer />}
    </>
  );
}

// Main App component that wraps the Layout component in a Router
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
         {/* // Render the Layout component */}
        <Layout />
      </div>
    </Router>
  );
}

export default App;
