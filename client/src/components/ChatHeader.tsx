import { Box, Button, Divider } from "@mui/material";
import { LiaSearchSolid } from "react-icons/lia";
import { BsCameraVideo } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { Chat } from "@/lib/types";
import { IoMdContact } from "react-icons/io";
import { useWebRTC } from "@/context/WebRTCProvider";
import { useUserInteraction } from "@/lib/hooks";
import { useState } from "react";
import { fetchData } from "@/lib/api";
import { formatTimeWithAmPm } from "@/lib/utils";

const ChatHeader = ({ chatData }: { chatData: Chat | null }) => {
  const { handleCall } = useWebRTC();
  const [status, setStatus] = useState("Online");
  const [lastSeenAt, setLastSeenAt] = useState("");

  const handleVideoCall = () => {
    handleCall({
      video: true,
      audio: true,
      to: chatData?.member?.id as string,
    });
  };

  const handleAudioCall = () => {
    handleCall({
      video: false,
      audio: true,
      to: chatData?.member?.id as string,
    });
  };

  const handleUserActivity = async () => {
    // Call your function here (e.g., update online status, reset timeout, etc.)
    if (!chatData?.isGroup) {
      const lastInteraction = Number(localStorage.getItem("lastInteraction"));
      if (lastInteraction) {
        console.log("Last interaction was at:", lastInteraction);
        // Check if last interaction is more than 1 minute
        const now = Date.now();
        const lastInteractionTime = new Date(lastInteraction).getTime();
        const timeDiff = now - lastInteractionTime;
        if (timeDiff > 1 * 60 * 1000) {
          localStorage.setItem("lastInteraction", String(Date.now()));
          const { status, lastSeenAt } = await fetchData<{
            status: string;
            lastSeenAt: string;
          }>(`user/check/online/status/${chatData?.member?.id}`);
          setStatus(status);
          setLastSeenAt(lastSeenAt);
        }
      } else {
        console.log("No last interaction found.");
        localStorage.setItem("lastInteraction", String(Date.now()));
      }
    }
  };

  useUserInteraction(handleUserActivity);

  return (
    <div className="h-[10%] flex justify-between items-center p-5">
      <div className="flex items-center gap-3">
        {chatData?.member?.profilePic ? (
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={chatData?.member?.profilePic}
              alt="Profile picture"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <IoMdContact className="text-5xl dark:fill-dark-tertiary fill-light-tertiary" />
        )}
        <div>
          <h5 className="dark:text-light-primary text-dark-primary">
            {chatData?.member?.name || chatData?.groupName}
          </h5>
          {chatData?.isGroup ? null : (
            <h6 className="text-xs dark:text-light-primary text-dark-primary">
              {status
                ? "Online"
                : `Last seen at ${formatTimeWithAmPm(lastSeenAt)}`}
            </h6>
          )}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <Box className="dark:bg-dark-tertiary/50 bg-light-tertiary/50 flex items-center rounded-md py-1">
          <Button onClick={handleVideoCall}>
            <BsCameraVideo />
          </Button>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            className="dark:bg-dark-primary bg-light-primary"
          />
          <Button onClick={handleAudioCall}>
            <IoCallOutline />
          </Button>
        </Box>
        <LiaSearchSolid />
      </div>
    </div>
  );
};

export default ChatHeader;
