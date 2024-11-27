"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (message: object) => any;
  messages: {
    text?: string;
    img?: string;
    audio?: string;
    video?: string;
    gif?: string;
  }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        text?: string;
        img?: string;
        audio?: string;
        video?: string;
        gif?: string;
      }[]
    >
  >;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, error, isLoading } = useUser();
  console.log(user, "user in socket");

  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<
    {
      text?: string;
      img?: string;
      audio?: string;
      video?: string;
      gif?: string;
    }[]
  >([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (message) => {
      if (!socket) return;
      socket.emit("event:message", {
        message,
        roomId: "cm2r8h95l0002t3zcuuk155hr",
        createdBy: user?.email,
      });
    },
    [socket, user?.email]
  );

  const onMessageReceived = useCallback((message: string) => {
    console.log(message, "message from server");
    setMessages((prevMessages) => [...prevMessages, JSON.parse(message)]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(_socket);
    _socket.emit("event:joinRoom", { roomId: "cm2r8h95l0002t3zcuuk155hr" });
    _socket.on("message", (message) => {
      onMessageReceived(message);
    });
    return () => {
      _socket.off("message", onMessageReceived);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
