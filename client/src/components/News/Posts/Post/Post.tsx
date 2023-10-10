import React, { useState, useEffect } from "react";
import { IPost } from "../../../../interfaces/post.interface";
import { FormatUtils } from "../../../../utils/Format";
import Comment from "./Comment/Comments";
import { useAppSelector } from "../../../../hooks/store.hooks";
import useSocket from "../../../../hooks/socket.hooks";
import { PenToSquareIcon } from "../../../Common/Icons/PenToSquareIcon";
import { TrashIcon } from "../../../Common/Icons/TrashIcon";
import { useNotifications } from "../../../../hooks/notifications.hook";
import axios from "axios";
import { FloppyDiskIcon } from "../../../Common/Icons/FloppyDiskIcon";

export const Post = ({ data }: { data: IPost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  const formattedDate = FormatUtils.formatDate(data.createdAt);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const [post, setPost] = useState<IPost>(data);
  const socket = useSocket();
  const { showNotifications } = useNotifications();

  useEffect(() => {
    socket?.on("post:edit:" + data._id, (newData) => {
      setPost({ ...post, content: newData.content });
    });

    return () => {
      socket?.off("post:edit:" + data._id);
    };
  }, [socket, post, data._id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/posts/${post._id}`, {
        content: editedContent,
        authorId: post.authorId._id,
      });
      setIsEditing(false);
      showNotifications(
        "success",
        "Post modifié",
        "Votre post a été modifié avec succès."
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de la modification du post",
        "Veuillez réessayer plus tard."
      );
    }
  };

  const handleDeletePost = async () => {
    const userConfirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce post et tous ses commentaires?"
    );
    if (!userConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:9000/posts/${post._id}`, {
        data: { authorId: post.authorId._id },
      });
      if (socket) {
        socket.emit("post:deleted", post._id);
      }
      showNotifications(
        "success",
        "Post supprimé",
        "Votre post et tous ses commentaires ont été supprimés avec succès."
      );
    } catch (error) {
      showNotifications(
        "error",
        "Erreur lors de la suppression du post",
        "Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <div className="post-container">
      <div className="post-author">
        <img
          src={
            post.authorId.profilePicture
              ? FormatUtils.urlPicture(post.authorId.profilePicture)
              : "http://localhost:9000/uploads/user.jpeg"
          }
          alt="profile thumbnail"
        />
        <span>
          {post.authorId.firstname} {post.authorId.lastname}
        </span>{" "}
        <span className="post-metadata">{formattedDate}</span>
      </div>
      {isEditing ? (
        <form onSubmit={handleSave}>
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
        <div className="postContainerContain">
          <p className="post-content">{post.content}</p>
          {post.authorId._id === currentUserId && (
            <div className="editingPostIcons">
              <PenToSquareIcon
                onClick={() => setIsEditing(true)}
                title="Modifier"
              />
              <TrashIcon
                data-action="delete"
                onClick={handleDeletePost}
                title="Supprimer"
              />
            </div>
          )}
        </div>
      )}
      <Comment postId={post._id} comments={post.comments} />
    </div>
  );
};
