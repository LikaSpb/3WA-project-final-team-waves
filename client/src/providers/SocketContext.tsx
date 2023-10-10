import React, { createContext, useState, useEffect } from "react";
import socketIOClient, { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

interface Props {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // @ts-ignore
  useEffect(() => {
    try {
      const newSocket = socketIOClient("http://localhost:9000");

      setSocket(newSocket);

      return () => newSocket.disconnect();
    } catch (e) {
      console.error("Le socket est non disponible !!");
    }
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {});
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
