import React, { useState, useEffect } from "react";
import { CreateComment } from "./CreateComment";
import axios from "axios";
import { IComment } from "../../../../../interfaces/comment.interface";
import useSocket from "../../../../../hooks/socket.hooks";
import { FormatUtils } from "../../../../../utils/Format";
import { useAppSelector } from "../../../../../hooks/store.hooks";
import { PenToSquareIcon } from "../../../../Common/Icons/PenToSquareIcon";
import { TrashIcon } from "../../../../Common/Icons/TrashIcon";
import { FloppyDiskIcon } from "../../../../Common/Icons/FloppyDiskIcon";
import { useNotifications } from "../../../../../hooks/notifications.hook";

interface CommentsProps {
  postId: string;
  comments: IComment[] | [];
}

const Comments = ({ postId, comments }: CommentsProps) => {
  const currentUserId = useAppSelector((state) => state.user.userId);
  const socket = useSocket();
  const { showNotifications } = useNotifications();
  const [localComments, setLocalComments] = useState<IComment[]>(comments);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleSaveEditedComment = async (
    e: React.FormEvent,
    commentId: string
  ) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/comments/${commentId}`, {
        content: editedContent,
        authorId: currentUserId,
      });

      const updatedComments = localComments.map((comment) =>
        comment._id === commentId
          ? { ...comment, content: editedContent }
          : comment
      );
      setLocalComments(updatedComments);
      setIsEditing(null);
      showNotifications(
        "success",
        "Commentaire modifié",
        "Votre commentaire a été modifié avec succès."
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de la modification du commentaire",
        "Veuillez réessayer plus tard."
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const userConfirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:9000/comments/${commentId}`, {
        data: { authorId: currentUserId },
      });

      const updatedComments = localComments.filter(
        (comment) => comment._id !== commentId
      );
      setLocalComments(updatedComments);
      showNotifications(
        "success",
        "Commentaire supprimé",
        "Votre commentaire a été supprimé avec succès."
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de la suppression du commentaire",
        "Veuillez réessayer plus tard."
      );
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(`comment:receive:${postId}`, (newCommentData) => {
        if (newCommentData && newCommentData.content) {
          setLocalComments((prevComments) => [
            ...prevComments,
            newCommentData.content,
          ]);
        }
      });

      socket.on(`comment:edited:${postId}`, (editedComment) => {
        setLocalComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editedComment._id ? editedComment : comment
          )
        );
      });

      socket.on(`comment:deleted:${postId}`, (deletedCommentId) => {
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== deletedCommentId)
        );
      });
    }

    return () => {
      if (socket) {
        socket.off(`comment:receive:${postId}`);
        socket.off(`comment:edited:${postId}`);
        socket.off(`comment:deleted:${postId}`);
      }
    };
  }, [socket, postId]);

  return (
    <div className="comment-container">
      {showComments && (
        <>
          {localComments.map((comment) => (
            <div key={comment._id} className="single-comment">
              <div className="comment-author-info">
                <img
                  src={FormatUtils.urlPicture(comment.authorId.profilePicture)}
                  alt="profile thumbnail"
                  className="comment-author-image"
                />
                <span className="comment-author-name">
                  {comment.authorId?.firstname} {comment.authorId?.lastname}
                </span>
                <span className="comment-date">
                  {FormatUtils.formatDate(comment.createdAt)}
                </span>
              </div>

              {isEditing === comment._id ? (
                <form
                  onSubmit={(e) => {
                    handleSaveEditedComment(e, comment._id);
                  }}
                >
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={5}
                  />
                  <button type="submit" className="icon-button">
                    <FloppyDiskIcon />
                  </button>
                </form>
              ) : (
                <>
                  <p className="comment-content">{comment.content}</p>
                  {comment.authorId?._id === currentUserId && (
                    <div className="icon-actions">
                      <PenToSquareIcon
                        onClick={() => {
                          setIsEditing(comment._id);
                          setEditedContent(comment.content);
                        }}
                        title="Modifier"
                      />
                      <TrashIcon
                        onClick={() => handleDeleteComment(comment._id)}
                        title="Supprimer"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <CreateComment postId={postId} />
        </>
      )}
      <button
        className="toggle-comments-button"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "Cacher les commentaires" : "Afficher les commentaires"}
      </button>
    </div>
  );
};

export default Comments;
