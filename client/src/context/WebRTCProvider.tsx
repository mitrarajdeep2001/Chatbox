import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSocket } from "./SocketProvider";
import Peer from "simple-peer";

type WebRTCContextType = {
  handleCall: ({
    video,
    audio,
    to,
  }: {
    video: boolean;
    audio: boolean;
    to: string;
  }) => Promise<void>;
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
  handleEndCall: () => void;
  isCallActive: boolean;
};

const WebRTC = createContext<WebRTCContextType | undefined>(undefined);

export const useWebRTC = (): WebRTCContextType => {
  const context = useContext(WebRTC);
  if (!context) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};

type WebRTCProviderProps = {
  children: ReactNode;
};

const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
  const { emitEvent, listenToEvent } = useSocket();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const peerRef = useRef<Peer.Instance | null>(null);

  const getMediaStream = useCallback(
    async (video: boolean, audio: boolean): Promise<MediaStream> => {
      return await navigator.mediaDevices.getUserMedia({ video, audio });
    },
    []
  );

  const handleCall = useCallback(
    async ({
      video,
      audio,
      to,
    }: {
      video: boolean;
      audio: boolean;
      to: string;
    }) => {
      const stream = await getMediaStream(video, audio);
      setMyStream(stream);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        emitEvent("event:callUser", { signal, audio, video, roomId: to });
      });

      peer.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        setIsCallActive(true);
      });

      peerRef.current = peer;
    },
    [emitEvent, getMediaStream]
  );

  const handleIncomingCall = useCallback(
    async ({
      signal,
      from,
      video,
      audio,
    }: {
      signal: Peer.SignalData;
      from: string;
      video: boolean;
      audio: boolean;
    }) => {
      const stream = await getMediaStream(video, audio);
      setMyStream(stream);

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        emitEvent("event:answerCall", { signal, roomId: from });
      });

      peer.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        setIsCallActive(true);
      });

      peer.signal(signal);
      peerRef.current = peer;
    },
    [emitEvent, getMediaStream]
  );

  const handleCallAccepted = useCallback(
    ({ signal }: { signal: Peer.SignalData }) => {
      peerRef.current?.signal(signal);
    },
    []
  );

  const handleEndCall = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    setMyStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
  }, [myStream]);

  useEffect(() => {
    listenToEvent("event:incomingCall", handleIncomingCall);
    listenToEvent("event:callAccepted", handleCallAccepted);
  }, [handleIncomingCall, handleCallAccepted]);

  return (
    <WebRTC.Provider
      value={{
        handleCall,
        myStream,
        remoteStream,
        handleEndCall,
        isCallActive,
      }}
    >
      {children}
    </WebRTC.Provider>
  );
};

export default WebRTCProvider;
