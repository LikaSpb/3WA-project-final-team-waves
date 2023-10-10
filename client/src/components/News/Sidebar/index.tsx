import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleChevronUpIcon } from "../../Common/Icons/CircleChevronUpIcon";

const Sidebar = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`sidebar ${isScrolling ? "scrolling" : ""}`}>
      <ul className={`${isScrolling ? "hidden" : ""}`}>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/main/profil">Profil</Link>
        </li>
      </ul>
      <div
        className={`scroll-to-top-button ${isScrolling ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        <div className="icon-container">
          <CircleChevronUpIcon />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
