import React from "react";
import NavBar from "../components/Common/NavBar";
import { Outlet } from "react-router-dom";

export default function HomePageLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
