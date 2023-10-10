import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal";
import { EmailIcon } from "../../Common/Icons/EmailIcon";
import { UserIcon } from "../../Common/Icons/UserIcon";
import { PasswordIcon } from "../../Common/Icons/PasswordIcon";
import { ChevronRightIcon } from "../../Common/Icons/ChevronRightIcon";
import { CameraIcon } from "../../Common/Icons/CameraIcon";
import ModalEditInformations from "../ModalEditInformations";
import ModalEditEmail from "../ModalEditEmail";
import ModalEditPassword from "../ModalEditPassword";
import ModalEditPhoto from "../ModalEditPhoto";
import { Config } from "../../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData as setReduxUserData } from "../../../store/slicers/user";
import { RootState } from "../../../store";
import ModalAdminViewAllUser from "../ModalAdminViewAllUser";
import { AdminIcon } from "../../Common/Icons/AdminIcon";
import { IUserRole } from "../../../interfaces/user.interface";
import { FormatUtils } from "../../../utils/Format";

export interface IUserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  jobTitle?: string;
  company?: string;
  password: string;
  profilePicture: string;
  role: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState<React.ReactNode | null>(
    null
  );

  const userData = useSelector((state: RootState) => state.user);

  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;

    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const userIdLocalStorage = window.localStorage.getItem("userId");

    if (!userIdLocalStorage || userIdLocalStorage === "") {
      navigate("/login");
      return;
    }

    axios
      .get(`${Config.baseUrlApi}/users/${userIdLocalStorage}`)
      .then((response) => {
        dispatch(setReduxUserData(response.data));
      })
      .catch((error) => {
        navigate("/login");
      });
  }, [dispatch, navigate]);

  const handleEditClick = (content: string) => {
    setIsEditModalOpen(true);

    if (content === "myInfo") {
      setModalComponent(
        <ModalEditInformations onClose={handleCloseModal} userData={userData} />
      );
    } else if (content === "email") {
      setModalComponent(
        <ModalEditEmail onClose={handleCloseModal} userData={userData} />
      );
    } else if (content === "password") {
      setModalComponent(
        <ModalEditPassword onClose={handleCloseModal} userData={userData} />
      );
    } else if (content === "viewAllUsers") {
      setModalComponent(
        <ModalAdminViewAllUser
          onClose={handleCloseModal}
          userData={{
            userId: "",
            email: "",
          }}
        />
      );
    } else if (content === "photo") {
      setModalComponent(
        <ModalEditPhoto onClose={handleCloseModal} userData={userData} />
      );
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setModalComponent(null);
  };

  return (
    <div className="profile-container">
      <div className="blue-section"></div>
      <div className="profile-card">
        <div className="user-avatar">
          <div className="avatar-container">
            <img
              src={FormatUtils.urlPicture(userData.profilePicture)}
              alt={`L'avatar de ${userData.firstname}`}
            />

            <button
              className="edit-avatar-button"
              onClick={() => handleEditClick("photo")}
            >
              <CameraIcon className="camera-icon" />
            </button>
          </div>
        </div>
        <div className="user-info">
          {userData ? (
            <>
              <div className="info-value">
                {userData.firstname} {userData.lastname}
              </div>
              <div className="info-age">
                {userData.dateOfBirth
                  ? `${calculateAge(userData.dateOfBirth)} ans`
                  : "Date de naissance non fournie"}
              </div>

              <div className="info-profession">{userData.jobTitle}</div>
              <div className="info-company">{userData.company}</div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
      <div className="account-settings-wrapper">
        <div className="account-settings">Account settings</div>
        <div className="info-card">
          <div className="info-option">
            <span className="custom-icon">
              <UserIcon />
            </span>
            <div className="info-label">My Information</div>
            <div
              className="info-link"
              onClick={() => handleEditClick("myInfo")}
            >
              <span className="chevron-icon">
                <ChevronRightIcon />
              </span>
            </div>
          </div>
          <div className="info-option">
            <span className="custom-icon">
              <EmailIcon />
            </span>
            <div className="info-label">Update Email Address</div>
            <div className="info-link" onClick={() => handleEditClick("email")}>
              <span className="chevron-icon">
                <ChevronRightIcon />
              </span>
            </div>
          </div>
          <div className="info-option">
            <span className="custom-icon">
              <PasswordIcon />
            </span>
            <div className="info-label">Reset Password</div>
            <div
              className="info-link"
              onClick={() => handleEditClick("password")}
            >
              <span className="chevron-icon">
                <ChevronRightIcon />
              </span>
            </div>
          </div>
          {userData.role === IUserRole.ADMIN && (
            <div className="info-option">
              <span className="custom-icon">
                <AdminIcon />
              </span>
              <div className="info-label">Voir tous les utilisateurs</div>
              <div
                className="info-link"
                onClick={() => handleEditClick("viewAllUsers")}
              >
                <span className="chevron-icon">
                  <ChevronRightIcon />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={handleCloseModal}>
          {modalComponent}
        </Modal>
      )}
    </div>
  );
};

export default Profile;
