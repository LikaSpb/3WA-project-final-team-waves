import React, { useState } from "react";
import { useNotifications } from "../../../../hooks/notifications.hook";
import axios, { AxiosError } from "axios";
import { Config } from "../../../../config";
import { useAppSelector } from "../../../../hooks/store.hooks";

export const CreatePost = () => {
  const [toggleNewPost, setToogleNewPost] = useState<boolean>(false);
  const [inputNewPost, setInputNewPost] = useState<string>("");
  const { showNotifications } = useNotifications();
  const userData = useAppSelector((state) => state.user);

  const sendNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNewPost === "")
      return showNotifications(
        "error",
        "New post",
        "Vous ne pouvez pas envoyer un post vide !"
      );

    try {
      await axios.post(`${Config.baseUrlApi}/posts`, {
        authorId: userData.userId,
        content: inputNewPost,
      });
      showNotifications("success", "New post", "Post envoyé avec succès");
      setToogleNewPost(false);
      setInputNewPost("");
    } catch (err) {
      const error = err as AxiosError;
      showNotifications("error", "Error request post comment", error.message);
    }
  };

  return (
    <div className="new-post">
      <p>Entrer votre nouveau post ici</p>
      <button onClick={() => setToogleNewPost(!toggleNewPost)}>
        Créer un post
      </button>

      {toggleNewPost && (
        <form onSubmit={sendNewPost}>
          <textarea
            value={inputNewPost}
            onChange={(e) => setInputNewPost(e.target.value)}
            rows={10}
          />
          <button type="submit">Envoyer</button>
        </form>
      )}
    </div>
  );
};
