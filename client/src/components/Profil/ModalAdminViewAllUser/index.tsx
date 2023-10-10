import React, { useState, useEffect } from "react";
import axios from "axios";
import { Config } from "../../../config";
import { IUser } from "../../../interfaces/user.interface";
import useSocket from "../../../hooks/socket.hooks";
import { useNotifications } from "../../../hooks/notifications.hook";

interface ModalAdminViewAllUserProps {
  onClose: () => void;
  userData: {
    userId: string;
    email: string;
  };
}

export const formatSrcPictureLink = (namePicture: string): string => {
  if (!namePicture) {
    return "http://localhost:9000/uploads/user.jpeg";
  }
  return `http://localhost:9000/pictures/${namePicture}`;
};

const ModalAdminViewAllUser: React.FC<ModalAdminViewAllUserProps> = ({
  onClose,
  userData,
}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const socket = useSocket();
  const { showNotifications } = useNotifications();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Config.baseUrlApi}/users`);
        setUsers(response.data);
      } catch (error) {
        showNotifications(
          "error",
          "Erreur de chargement",
          "Impossible de charger la liste des utilisateurs. Veuillez réessayer plus tard."
        );
      }
    };

    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket?.on("user:connected", (user: IUser) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket?.on("user:disconnected", (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    });

    return () => {
      socket?.off("user:connected");
      socket?.off("user:disconnected");
    };
  }, [socket]);
 
  return (
    <div className={`modal ${userData ? "is-open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Liste des utilisateurs</h2>
        </div>
        <div className="users-list">
          {users.map((user) => (
            <div
              key={user._id}
              className={`user-item ${user.connected ? "connected" : ""}`}
            >
              <div
                className={`status-container ${
                  user.connected ? "online" : "offline"
                }`}
              >
                <img
                  src={formatSrcPictureLink(user.profilePicture)}
                  alt={`L'avatar de ${user.firstname}`}
                />
                <span
                  className={`status-dot ${
                    user.connected ? "online" : "offline"
                  }`}
                ></span>
              </div>
              <div className="user-info">
                <span className="username">
                  {user.firstname} {user.lastname}
                </span>
                <span
                  className={`user-status ${
                    user.connected ? "online" : "offline"
                  }`}
                >
                  {user.connected ? "En ligne" : "Hors ligne"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="close-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdminViewAllUser;
