import { Button } from "@mui/material";
import { FaRegSmile } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FiMic } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSocket } from "@/context/SocketProvider"; // Assuming you have a socket provider
import { useAuth } from "@/context/AuthProvider"; // Assuming you have an auth provider
import { useApi, useLocalState } from "@/lib/hooks";
import Picker from "@emoji-mart/react";
import EmojiPicker from "./EmojiePicker";

const ChatFooter = ({ chatData }: { chatData: object | null }) => {
  const { setState } = useLocalState("message");
  const { id: chatId } = useParams(); // Chat ID from route params
  const { user } = useAuth(); // Access user info from the auth context
  const { emitEvent } = useSocket(); // Access emitEvent function from the socket context
  const { data } = useApi(
    "GET",
    "/misc/emojies",
    {},
    {},
    {
      staleTime: 6 * 24 * 60 * 60 * 1000, // Data is fresh for 6 days
      gcTime: 7 * 24 * 60 * 60 * 1000, // Data is kept in cache for 7 days
      // refetchOnWindowFocus: false,
      queryKey: ["emojies"],
    }
  );

  const [message, setMessage] = useState({
    chatId: chatId || "", // Foreign key to the Chat table
    createdBy: user?.uid || "", // User ID of the message creator
    createdAt: Date.now(), // Timestamp of message creation
    text: "", // Message text
    emojie: "", // Optional emoji
    image: "", // Optional image URL
    audio: "", // Optional audio URL
    video: "", // Optional video URL
    gif: "", // Optional GIF URL
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji: any) => {
    updateMessage("text", message.text + emoji.native);
  };

  // Function to handle message field updates
  const updateMessage = (key: string, value: string) => {
    setMessage((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Function to send the message
  const sendMessage = () => {
    if (!message.text.trim()) return; // Prevent sending empty messages

    // Set the message state
    setState(message);

    // Emit the message event
    emitEvent("event:sendMessage", message);

    // Reset the message text field
    setMessage((prev) => ({
      ...prev,
      text: "", // Clear text after sending
    }));
  };

  return (
    <>
      {/* Use the EmojiPicker component */}
      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={addEmoji}
      />
      <div className="h-[7%] w-full flex justify-between items-center p-5 dark:bg-dark-primary bg-light-primary">
        <div className="flex items-center relative">
          <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
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
            value={message.text}
            onChange={(e) => updateMessage("text", e.target.value)} // Update the text field
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(); // Send message on Enter key press
            }}
            className="w-full bg-transparent border-none outline-none dark:text-light-primary text-dark-primary"
          />
          <Button onClick={sendMessage}>
            <FiMic />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatFooter;
