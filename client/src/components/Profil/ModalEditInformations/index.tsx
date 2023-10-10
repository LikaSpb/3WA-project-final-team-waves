import React, { useState } from "react";
import { useAppDispatch } from "../../../hooks/store.hooks";
import axios from "axios";
import { Config } from "../../../config";
import { setUserData } from "../../../store/slicers/user";
import { useNotifications } from "../../../hooks/notifications.hook";

interface IModalEditInformationsProps {
  onClose: () => void;
  userData: {
    userId: string;
    firstname: string;
    lastname: string;
    dateOfBirth?: string;
    jobTitle?: string;
    company?: string;
  };
}

const ModalEditInformations: React.FC<IModalEditInformationsProps> = ({
  onClose,
  userData,
}) => {
  const [firstName, setFirstName] = useState(userData.firstname);
  const [lastName, setLastName] = useState(userData.lastname);
  const [jobTitle, setJobTitle] = useState(userData.jobTitle || "");
  const [company, setCompany] = useState(userData.company || "");
  const { showNotifications } = useNotifications();

  const dispatch = useAppDispatch();

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const [dateOfBirth, setDateOfBirth] = useState(
    userData.dateOfBirth ? formatDate(userData.dateOfBirth) : ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${Config.baseUrlApi}/users/${userData.userId}`,
        {
          firstname: firstName,
          lastname: lastName,
          dateOfBirth,
          jobTitle,
          company,
        }
      );
      dispatch(setUserData(response.data));
      onClose();

      showNotifications(
        "success",
        "Mise à jour réussie",
        "Vos informations ont été mises à jour avec succès.",
        5000
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de la mise à jour",
        "Une erreur est survenue lors de la mise à jour de vos informations. Veuillez réessayer.",
        5000
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Modifier les informations</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Prénom:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Nom:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Date de naissance:
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={formatDate(new Date().toISOString())}
            />
          </label>
          <label>
            Métier:
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Entreprise:
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </label>

          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditInformations;
