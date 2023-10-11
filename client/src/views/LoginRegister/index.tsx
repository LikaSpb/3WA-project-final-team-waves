import React, { useState } from "react";
import Login from "../../components/Login";
import Register from "../../components/Register";
import logo from "../../assets/static/logo.png";
import useAuth from "../../hooks/auth.hooks";


const LoginRegister: React.FC = () => {
  useAuth();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-register-wrapper">
      <div className="left-container">
        <img src={logo} alt="" />
      </div>
      <div className="login-register-container">
        <div className="logo-container">
          <img src={logo} alt="Logo avec les vagues" className="logo" />
          <h1>Team Waves</h1>
        </div>
        {isLogin ? (
          <Login onRegisterClick={() => setIsLogin(false)} />
        ) : (
          <Register onLoginClick={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
