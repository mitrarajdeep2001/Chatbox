import { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import Logo from "./svgs/Logo";
import { useAuth } from "@/context/AuthProvider";
import { useSocket } from "@/context/SocketProvider";
import Stream from "./Stream";
import { useWebRTC } from "@/context/WebRTCProvider";
import { Chat } from "@/lib/types";
import { fetchData } from "@/lib/api";

const Chatbox = ({ id }: { id: string | null }) => {
  const { user } = useAuth();
  const { joinRoom } = useSocket();
  const { myStream, remoteStream } = useWebRTC();

  const [chatData, setChatData] = useState<Chat | null>(null);

  // get chat data
  const getChatData = async () => {
    try {
      const data = await fetchData<Chat>(`/chat/${id}?userId=${user?.uid}`);
      setChatData(data);
    } catch (error) {
      console.log("getChatData() ->>", error);
    }
  };
  useEffect(() => {
    if (id) {
      getChatData();
      joinRoom(id);
    }
  }, [id]);

  return (
    <>
      <Stream myStream={myStream} remoteStream={remoteStream} />
      <div className="w-[70%] flex flex-col justify-between h-screen">
        {typeof id === "string" ? (
          <>
            <ChatHeader chatData={chatData} />
            <ChatBody chatData={chatData} />
            <ChatFooter chatData={chatData} />
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen">
            <Logo width={200} height={200} />
            <h4 className="text-3xl font-bold dark:text-light-primary text-dark-primary">
              ChatBox
            </h4>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbox;
