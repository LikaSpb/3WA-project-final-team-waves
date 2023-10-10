import React, { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/store.hooks";
import { Config } from "../../../config";
import { setUserData } from "../../../store/slicers/user";
import { useNotifications } from "../../../hooks/notifications.hook";

interface ModalEditEmailProps {
  onClose: () => void;
  userData: {
    userId: string;
    email: string;
  };
}

const ModalEditEmail: React.FC<ModalEditEmailProps> = ({
  onClose,
  userData,
}) => {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const { showNotifications } = useNotifications();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(event.target.value);
  };

  const handleConfirmEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newEmail || !confirmEmail) {
      setErrorMessage("Veuillez remplir tous les champs.");
      showNotifications(
        "error",
        "Champs manquants",
        "Veuillez remplir tous les champs.",
        5000
      );
      return;
    }

    if (newEmail === confirmEmail) {
      try {
        const response = await axios.put(
          `${Config.baseUrlApi}/users/${userData.userId}`,
          {
            email: newEmail,
          }
        );
        dispatch(setUserData(response.data));
        showNotifications(
          "success",
          "Mise à jour réussie",
          "Votre adresse e-mail a été mise à jour avec succès.",
          5000
        );
        onClose();
      } catch (error) {
        setErrorMessage("Erreur lors de la mise à jour de l'adresse e-mail.");
        showNotifications(
          "error",
          "Erreur lors de la mise à jour",
          "Une erreur est survenue lors de la mise à jour de votre adresse e-mail. Veuillez réessayer.",
          5000
        );
      }
    } else {
      setErrorMessage("Les adresses e-mail ne correspondent pas.");
      showNotifications(
        "error",
        "Adresses e-mail non concordantes",
        "Les adresses e-mail que vous avez entrées ne correspondent pas. Veuillez vérifier et réessayer.",
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
        <h2>Modifier l'adresse e-mail</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nouvelle adresse e-mail:
            <input type="email" value={newEmail} onChange={handleEmailChange} />
          </label>
          <label>
            Confirmer la nouvelle adresse e-mail:
            <input
              type="email"
              value={confirmEmail}
              onChange={handleConfirmEmailChange}
            />
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditEmail;
