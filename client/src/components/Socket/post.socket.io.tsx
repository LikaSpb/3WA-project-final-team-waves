import io from "socket.io-client";

const socket = io("http://localhost:9000", { transports: ["websocket"] });

export const emitNewPost = (newPost: any) => {
  socket.emit("new-post", newPost);
};

export const subscribeToNewPosts = (callback: (newPost: any) => void) => {
  socket.on("new-post", (newPost) => {
    callback(newPost);
  });
};

export const emitNewComment = (newComment: any) => {
  socket.emit("new-comment", newComment);
};

export const subscribeToNewComments = (callback: (newComment: any) => void) => {
  socket.on("new-comment", (newComment) => {
    callback(newComment);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};
