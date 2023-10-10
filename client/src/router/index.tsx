import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import LoginRegister from "../views/LoginRegister";
import AuthLayout from "../layouts/AuthLayout";
import News from "../views/NewsPage";
import ProfilPage from "../views/ProfilPage";
import Profil from "../components/Profil/Profil";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginRegister />,
  },
  {
    path: "/main",
    element: <AuthLayout />,
    children: [
      {
        path: "/main/news",
        element: <News />,
      },
      {
        path: "/main/profil",
        element: <Profil />,
      },
    ],
  },
  {
    path: "/profil",
    element: <AuthLayout />,
    children: [
      {
        path: "main/profil",
        element: <ProfilPage />,
      },
    ],
  },
]);
