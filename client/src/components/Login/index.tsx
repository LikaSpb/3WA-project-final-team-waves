import axios from "axios";
import React, { useState } from "react";
import { Config } from "../../config";
import { useNavigate } from "react-router-dom";
import { EyeSlashIcon } from "../Common/Icons/EyeSlashIcon";
import { useNotifications } from "../../hooks/notifications.hook";
import { useAppDispatch } from "../../hooks/store.hooks";
import { setInitConnector, setUserData } from "../../store/slicers/user";
import useSocket from "../../hooks/socket.hooks";

interface ILoginProps {
  onRegisterClick: () => void;
}

const Login: React.FC<ILoginProps> = ({ onRegisterClick }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { showNotifications } = useNotifications();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${Config.baseUrlApi}/auth/login`,
        formData
      );

      const { _id, firstname, token } = response.data;

      if (remember) {
        window.localStorage.setItem("authToken", token);
        window.localStorage.setItem("userId", _id);
      } else {
        setAuthToken(token);
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (socket) socket.emit("storeConnection", { id: _id });

      dispatch(setInitConnector());
      dispatch(setUserData(response.data));

      navigate("/main/news");
      showNotifications(
        "success",
        "Bienvenue",
        `Bonjour, ${firstname} !`,
        5000
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur de connexion",
        "Identifiants invalides",
        5000
      );
      setLoginError("Identifiants invalides");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Se connecter</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="password-input">
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeSlashIcon />
              </div>
            </div>
          </div>
          {loginError && <p className="error-message">{loginError}</p>}
          <div className="remember-forgot">
            <label className="remember-label">
              <input
                type="checkbox"
                onChange={(e) => setRemember(e.target.checked)}
                checked={remember}
              />
              <span className="remember-text">Se souvenir de moi</span>
            </label>
          </div>

          <button type="submit">Se connecter</button>
        </form>
        <div className="register-link">
          <span>Vous n'avez pas de compte ?</span>
          <button onClick={onRegisterClick}>Créer un compte</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
