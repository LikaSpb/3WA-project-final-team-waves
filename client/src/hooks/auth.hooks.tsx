// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Config } from "../config";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store.hooks";
import { setInitConnector, setUserData } from "../store/slicers/user";
import useSocket from "./socket.hooks";

export default function useAuth() {
  const [auth, setAuth] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const socket = useSocket();

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${Config.baseUrlApi}/auth/token`);
      dispatch(setUserData(response.data));
      setAuth(true);

      if (!user.initSocketConnector && response.data._id) {
        if (socket) socket.emit("storeConnection", { id: response.data._id });
        dispatch(setInitConnector());
      }
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line
  }, [socket]);

  return { auth };
}
