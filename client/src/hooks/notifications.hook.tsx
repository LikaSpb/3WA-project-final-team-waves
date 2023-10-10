import React from "react";
import { useAppDispatch } from "./store.hooks";
import { changeValue, clearValue } from "../store/slicers/notification";

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const showNotifications = (
    type: "success" | "danger" | "error",
    title: string,
    message: string,
    timer?: number
  ) => {
    const finaltimer = timer ?? 2000;
    dispatch(clearValue());

    dispatch(
      changeValue({
        title,
        message,
        type,
        show: true,
      })
    );

    const timerAddLeaveNotif = finaltimer - 500;
    setTimeout(() => {
      const notifDiv = document.querySelector(".Notification");
      notifDiv?.classList.add("leaveNotif");
    }, timerAddLeaveNotif);

    setTimeout(() => {
      dispatch(clearValue());
    }, finaltimer);
  };

  return { showNotifications };
};
