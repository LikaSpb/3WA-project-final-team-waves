import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/static/logo.png";
import { Config } from "../../../config";
import axios from "axios";
import { useAppSelector } from "../../../hooks/store.hooks";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (!event.target.closest(".navbar-menu")) {
          setIsMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await axios.post(`${Config.baseUrlApi}/auth/logout`, { id: user.userId });
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo avec les vagues" />
          Team Waves
        </Link>
        <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-icon" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          {isMenuOpen && (
            <ul className="navbar-links">
              <li className="navbar-item">
                <Link to="/main/news" className="navbar-link">
                  Accueil
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="profil" className="navbar-link">
                  Mon Profil
                </Link>
              </li>
              <li className="navbar-item">
                <span className="navbar-link" onClick={handleLogout}>
                  Déconnexion
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
