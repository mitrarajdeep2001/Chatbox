import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";
import { disconnectSocket, initializeSocket } from "@/lib/socketService";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {
  joinRoom: (roomId: string) => void;
  emitEvent: (event: string, data: any) => void;
  listenToEvent: (event: string, callback: (data: any) => void) => void;
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  socketRef.current = initializeSocket(import.meta.env.VITE_SOCKET_URL);

  useEffect(() => {
    if (user?.uid) {
      joinRoom(user?.uid);
    }
    // Cleanup on unmount
    return () => {
      disconnectSocket();
      socketRef.current = null;
    };
  }, [user?.uid, socketRef.current]); // Dependency to reinitialize socket if user changes

  // Emit a custom event
  const emitEvent = useCallback(
    (event: string, data: any) => {
      if (!socketRef.current) {
        console.error("Socket is not connected");
        return;
      }
      socketRef.current.emit(event, data);
    },
    [socketRef.current]
  );

  // Listen to a custom event
  const listenToEvent = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (!socketRef.current) {
        console.error("Socket is not connected");
        return;
      }
      socketRef.current.on(event, callback);

      return () => {
        socketRef.current?.off(event, callback); // Cleanup listener on unmount
      };
    },
    [socketRef.current]
  );

  // Join a room
  const joinRoom = useCallback(
    (roomId: string) => {
      if (!socketRef.current) {
        console.error("Socket is not connected");
        return;
      }
      socketRef.current.emit("event:joinRoom", { roomId });
      console.log(`Joined room: ${roomId}`);
    },
    [socketRef.current]
  );

  return (
    <SocketContext.Provider
      value={{
        joinRoom,
        emitEvent,
        listenToEvent,
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
