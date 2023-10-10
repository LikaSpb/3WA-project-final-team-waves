import React, { useEffect, useState } from "react";
import { IPost } from "../../../interfaces/post.interface";
import axios, { AxiosError } from "axios";
import { Config } from "../../../config";
import { useNotifications } from "../../../hooks/notifications.hook";
import { Post } from "./Post/Post";
import { CreatePost } from "./Post/CreatePost";
import useSocket from "../../../hooks/socket.hooks";

export const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const { showNotifications } = useNotifications();
  const socket = useSocket();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${Config.baseUrlApi}/posts`);
      setPosts(response.data);
    } catch (err) {
      const error = err as AxiosError;
      showNotifications("error", "Error posts requests", error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;
    fetchPosts();

    socket.on("post:receive", (newPost) => {
      setPosts((p) => [newPost, ...p]);
    });

    socket.on("post:deleted", (deletedPostId) => {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== deletedPostId)
      );
    });

    return () => {
      socket.off("post:receive");
      socket.off("post:deleted");
    };
    // eslint-disable-next-line
  }, [socket]);

  return (
    <div className="posts-container">
      <CreatePost />
      {posts.map((post) => (
        <Post key={post._id} data={post} />
      ))}
    </div>
  );
};
