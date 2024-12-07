import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (url: string): Socket => {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
