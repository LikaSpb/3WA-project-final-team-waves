import React from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/auth.hooks";
import NavBar from "../components/Common/NavBar";

const AuthLayout: React.FC = () => {
  useAuth();
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
