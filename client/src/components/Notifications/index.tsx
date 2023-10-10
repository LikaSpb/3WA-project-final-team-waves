import React from "react";
import { useAppSelector } from "../../hooks/store.hooks";

export default function Notifications() {
  const { show, title, message, type } = useAppSelector(
    (state) => state.notifications
  );

  if (!show) return null;

  const className = `Notification ${type}`;

  return (
    <div className={className}>
      <header>
        <p>{title}</p>
      </header>
      <main>
        <span>{message}</span>
      </main>
    </div>
  );
}
