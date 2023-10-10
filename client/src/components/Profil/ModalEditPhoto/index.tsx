import React, { useState } from "react";
import { Config } from "../../../config";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/store.hooks";
import { setUserData } from "../../../store/slicers/user";
import { useNotifications } from "../../../hooks/notifications.hook";

interface ModalEditPhotoProps {
  onClose: () => void;
  userData: {
    userId: string;
    profilePicture: string;
  };
}

const ModalEditPhoto: React.FC<ModalEditPhotoProps> = ({
  onClose,
  userData,
}) => {
  const dispatch = useAppDispatch();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const { showNotifications } = useNotifications();

  const updateProfilePhoto = async () => {
    try {
      if (!selectedPhoto) {
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", selectedPhoto);

      const response = await axios.put(
        `${Config.baseUrlApi}/users/${userData.userId}/profilepicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(setUserData(response.data));
      onClose();
      showNotifications(
        "success",
        "Photo de profil",
        "Votre photo de profil a été mise à jour avec succès!"
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur de mise à jour",
        "Une erreur s'est produite lors de la mise à jour de votre photo de profil. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Changer la photo de profil</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={() => {
            updateProfilePhoto();
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default ModalEditPhoto;
