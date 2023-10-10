import React, { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/store.hooks";
import { Config } from "../../../config";
import { setUserData } from "../../../store/slicers/user";
import { useNotifications } from "../../../hooks/notifications.hook";
import { EyeSlashIcon } from "../../Common/Icons/EyeSlashIcon";

interface ModalEditPasswordProps {
  onClose: () => void;
  userData: {
    userId: string;
    password: string;
  };
}

const ModalEditPassword: React.FC<ModalEditPasswordProps> = ({
  onClose,
  userData,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const { showNotifications } = useNotifications();

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleCurrentPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword === currentPassword) {
      setErrorMessage(
        "Le nouveau mot de passe ne doit pas être identique au mot de passe actuel."
      );
      showNotifications(
        "error",
        "Mot de passe identique",
        "Le nouveau mot de passe ne doit pas être identique au mot de passe actuel. Veuillez choisir un autre mot de passe.",
        5000
      );
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs.");
      showNotifications(
        "error",
        "Champs manquants",
        "Veuillez remplir tous les champs.",
        5000
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      showNotifications(
        "error",
        "Mots de passe non concordants",
        "Les nouveaux mots de passe ne correspondent pas. Veuillez vérifier et réessayer.",
        5000
      );
      return;
    }

    try {
      const requestData = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };

      await axios.put(
        `${Config.baseUrlApi}/users/changepsw/${userData.userId}`,
        requestData
      );
      showNotifications(
        "success",
        "Mise à jour réussie",
        "Votre mot de passe a été mis à jour avec succès.",
        5000
      );
      onClose();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du mot de passe.");
      showNotifications(
        "error",
        "Erreur lors de la mise à jour",
        "Une erreur est survenue lors de la mise à jour de votre mot de passe. Veuillez réessayer.",
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
        <h2>Modifier le mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Mot de passe actuel:
            <div className="input-container">
              <input
                type={isCurrentPasswordVisible ? "text" : "password"}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
              />
              <div
                className="eye-icon"
                onClick={toggleCurrentPasswordVisibility}
              >
                <EyeSlashIcon />
              </div>
            </div>
          </label>
          <label>
            Nouveau mot de passe:
            <div className="input-container">
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <div className="eye-icon" onClick={toggleNewPasswordVisibility}>
                <EyeSlashIcon />
              </div>
            </div>
          </label>
          <label>
            Confirmer le nouveau mot de passe:
            <div className="input-container">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <div
                className="eye-icon"
                onClick={toggleConfirmPasswordVisibility}
              >
                <EyeSlashIcon />
              </div>
            </div>
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Enregistrer</button>

          <div className="password-rules">
            <p className={newPassword.length >= 8 ? "valid" : "invalid"}>
              Au moins 8 caractères
            </p>
            <p className={/[A-Z]/.test(newPassword) ? "valid" : "invalid"}>
              Une majuscule
            </p>
            <p className={/[a-z]/.test(newPassword) ? "valid" : "invalid"}>
              Une minuscule
            </p>
            <p className={/\d/.test(newPassword) ? "valid" : "invalid"}>
              Un chiffre
            </p>
            <p
              className={
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(newPassword)
                  ? "valid"
                  : "invalid"
              }
            >
              Un caractère spécial
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditPassword;
