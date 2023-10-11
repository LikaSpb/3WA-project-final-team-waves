import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/static/logo.png";

const Home = () => {
  return (
    <div className="main">
      <header>
        <div className="logo-text-container">
          <div className="logo">
            <img src={logo} alt="Logo avec les vagues" />
          </div>
          <div className="text">
            <h1>Team Waves</h1>
            <h2>Riding the wave of success</h2>
            <Link to="/login" className="custom-button">
              Start Your Journey
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
