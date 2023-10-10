import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Config } from "../../config";
import { EyeSlashIcon } from "../Common/Icons/EyeSlashIcon";
import { useNotifications } from "../../hooks/notifications.hook";

interface IRegisterProps {
  onLoginClick: () => void;
}

const Register: React.FC<IRegisterProps> = ({ onLoginClick }) => {
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    email: "",
    jobTitle: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { showNotifications } = useNotifications();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [dateError, setDateError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dateOfBirth") {
      if (new Date(value) > new Date()) {
        setDateError(
          "La date de naissance ne peut être supérieure à la date d'aujourd'hui."
        );
      } else {
        setDateError(null);
      }
    }
  };

  const handleRegister = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (new Date(registerData.dateOfBirth) > new Date()) {
      setDateError(
        "La date de naissance ne peut être supérieure à la date d'aujourd'hui."
      );
      return;
    } else {
      setDateError(null);
    }

    if (registerData.password !== registerData.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      const response = await axios.post(
        `${Config.baseUrlApi}/users/login`,
        registerData
      );

      localStorage.setItem("userId", response.data.userId);

      setRegistrationSuccess(true);
      showNotifications(
        "success",
        "Enregistrement",
        "Nouvel utilisateur enregistré ! Redirection vers la page de connexion..."
      );
      onLoginClick();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.emailError) {
          setEmailError("L'adresse e-mail est déjà utilisée.");
          showNotifications(
            "error",
            "Erreur d'enregistrement",
            "L'adresse e-mail est déjà utilisée."
          );
        } else {
          showNotifications(
            "error",
            "Erreur d'enregistrement",
            "Une erreur s'est produite lors de la création de votre compte. Veuillez réessayer.",
            5000
          );
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {registrationSuccess && (
          <div className="success-message">
            Le compte a bien été créé. Veuillez vous connecter maintenant.
          </div>
        )}
        <button className="back-button" onClick={onLoginClick}>
          Retour
        </button>
        <h3>Créer un compte</h3>
        <form className="login-form">
          <div className="input-container">
            <input
              type="text"
              name="firstname"
              placeholder="Mon prénom"
              value={registerData.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="lastname"
              placeholder="Mon nom"
              value={registerData.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date de naissance"
              value={registerData.dateOfBirth}
              onChange={handleInputChange}
              max={today}
            />
            {dateError && <div className="error-message">{dateError}</div>}
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleInputChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div className="input-container">
            <input
              type="text"
              name="jobTitle"
              placeholder="Mon métier"
              value={registerData.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              name="company"
              placeholder="Mon entreprise"
              value={registerData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleInputChange}
            />
            <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <EyeSlashIcon />
            </div>
          </div>
          <div className="input-container">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerData.confirmPassword}
              onChange={handleInputChange}
            />
            <div
              className="eye-icon"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              <EyeSlashIcon />
            </div>
          </div>
          {passwordMatchError && (
            <div className="error-message">
              Les mots de passe ne correspondent pas.
            </div>
          )}

          <div className="password-rules">
            <div
              className={
                registerData.password.length >= 8 ? "valid" : "invalid"
              }
            >
              <p className={registerData.password.length >= 8 ? "valid" : ""}>
                Au moins 8 caractères
              </p>
              <p className={/[A-Z]/.test(registerData.password) ? "valid" : ""}>
                Une majuscule
              </p>
              <p className={/[a-z]/.test(registerData.password) ? "valid" : ""}>
                Une minuscule
              </p>
              <p className={/\d/.test(registerData.password) ? "valid" : ""}>
                Un chiffre
              </p>
              <p
                className={
                  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(
                    registerData.password
                  )
                    ? "valid"
                    : ""
                }
              >
                Un caractère spécial
              </p>
            </div>
          </div>

          <button type="submit" onClick={handleRegister}>
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
