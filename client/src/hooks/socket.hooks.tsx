import { useContext } from "react";
import { SocketContext } from "../providers/SocketContext";

export default function useSocket() {
  const { socket } = useContext(SocketContext);
  return socket;
}

// const socket = useSocket()
// socket.emit('tonevent', data)
// useEffect (() => { 
//  socket.on('tatafaitdesflanc', (data) => Je set mon useState ou autre)
//}, [])