import { Button } from "@mui/material";
import { FaRegSmile } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FiMic } from "react-icons/fi";

const ChatFooter = ({ chatData }: { chatData: object | null }) => {
  console.log(chatData, "chatData");

  return (
    <div className="h-[7%] w-full flex justify-between items-center p-5 dark:bg-dark-primary bg-light-primary">
      <div className="flex items-center">
        <Button>
          <FaRegSmile />
        </Button>
        <Button>
          <GrAttachment />
        </Button>
      </div>
      <div className="flex items-center w-full">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full bg-transparent border-none outline-none dark:text-light-primary text-dark-primary"
        />
        <Button>
          <FiMic />
        </Button>
      </div>
    </div>
  );
};

export default ChatFooter;
