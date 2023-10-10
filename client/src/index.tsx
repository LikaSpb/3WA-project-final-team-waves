import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import axios from "axios";
import "./assets/scss/main.scss";
import { Provider } from "react-redux";
import { store } from "./store";
import Notifications from "./components/Notifications";
import SocketProvider from "./providers/SocketContext";

axios.defaults.withCredentials = true;

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <SocketProvider>
        <Notifications />
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  );
}
