import { useContext } from "react";
import { SocketContext } from "../providers/SocketContext";

export default function useSocket() {
  const { socket } = useContext(SocketContext);
  return socket;
}
