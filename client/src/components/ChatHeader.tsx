import { Box, Button, Divider } from "@mui/material";
import { LiaSearchSolid } from "react-icons/lia";
import { BsCameraVideo } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { Chat } from "@/lib/types";
import { IoMdContact } from "react-icons/io";
import { useWebRTC } from "@/context/WebRTCProvider";

const ChatHeader = ({ chatData }: { chatData: Chat | null }) => {
  const { handleCall } = useWebRTC();

  const handleVideoCall = () => {
    handleCall({ video: true, audio: true, to: chatData?.member?.id as string});
  };

  const handleAudioCall = () => {
    handleCall({ video: false, audio: true, to: chatData?.member?.id as string});
  };

  return (
      <div className="h-[10%] flex justify-between items-center p-5">
        <div className="flex items-center gap-3">
          {chatData?.member?.profilePic ? (
            <img
              src={chatData?.member?.profilePic}
              alt="Profile picture"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <IoMdContact className="text-5xl dark:fill-dark-tertiary fill-light-tertiary" />
          )}
          <h5 className="dark:text-light-primary text-dark-primary">
            {chatData?.member?.name || chatData?.groupName}
          </h5>
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
