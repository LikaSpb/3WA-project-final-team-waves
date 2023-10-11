import React, { useState } from "react";
import axios from "axios";
import { useNotifications } from "../../../../../hooks/notifications.hook";
import { Config } from "../../../../../config";
import { useAppSelector } from "../../../../../hooks/store.hooks";

export const CreateComment = ({ postId }: { postId: string }) => {
  const { showNotifications } = useNotifications();
  const [commentContent, setCommentContent] = useState<string>("");
  const user = useAppSelector((state) => state.user);

  const handleCommentSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await axios.post(`${Config.baseUrlApi}/comments/${postId}`, {
        content: commentContent,
        postId,
        authorId: user.userId,
      });
      showNotifications(
        "success",
        "Commentaire ajouté",
        "Votre commentaire a été ajouté avec succès."
      );
      setCommentContent("");
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de l'ajout du commentaire",
        "Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <form className="comment-form">
      <textarea
        placeholder="Ajoutez un commentaire..."
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        rows={2}
        autoFocus
      />
      <button onClick={handleCommentSubmit}>Envoyer</button>
    </form>
  );
};
