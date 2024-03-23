import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RoutesComponent from "./Routes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import NavBar from "./components/Tasks/NavBar";

function App() {
  const [currentPage, setCurrentPage] = useState("main");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentPage('/');
    } else {
      setCurrentPage(location.pathname);
    }
  }, [location]);

  const renderContent = () => {
    if (currentPage === "/") {
      return <Main />;
    } else {
      console.log(currentPage);
      return (
        <div className="flex">
          {/* <UI /> */}
          <NavBar/>
          <RoutesComponent />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header />
        {renderContent()}
        {/* <RoutesComponent/> */}
      <Footer />
    </div>
  );
}

export default App;
