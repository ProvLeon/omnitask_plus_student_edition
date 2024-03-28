import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation, Navigate } from "react-router-dom";
import RoutesComponent from "./Routes";
import Footer from "./components/Footer";
import Header from "./components/Tasks/NaviBar";


const Layout = () => {
  const location = useLocation();


  // Always show the footer except on the LandingPage
  const showFooter = location.pathname !== "/";
  // Exclude the header on the SignUp, Login, and NotFoundPage
  const showHeader = !["/", "/signup", "/login", "/404"].includes(location.pathname);


  return (
    <>
      {showHeader && <Header />}
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
