import { Button } from "@mui/material";
import { FaRegSmile } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FiMic } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketProvider"; // Assuming you have a socket provider
import { useAuth } from "@/context/AuthProvider"; // Assuming you have an auth provider
import EmojiPicker from "./EmojiePicker";
import AttachmentMenu from "./AttachmentMenu";
import { MdAudioFile, MdGifBox, MdImage } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import GifPicker from "./GifPicker";
import { formatTime, getMediaFileDataUri } from "@/lib/utils";
import { RxCrossCircled } from "react-icons/rx";
import MediaPreview from "./MediaPreview";
import { IoMdSend } from "react-icons/io";
import { IoSendOutline } from "react-icons/io5";
import TypingBoxWithMic from "./TypingBoxWithMic";
import { Message } from "@/lib/types";
import { useGeneralContext } from "@/context/GeneralProvider";
import ReplyPreview from "./ReplyPreview";

const ChatFooter = ({ chatData }: { chatData: object | null }) => {
  const { setGlobalMessageState, globalMessageState, setShowReplyPreview } = useGeneralContext();
  const { id: chatId } = useParams(); // Chat ID from route params
  const { user } = useAuth(); // Access user info from the auth context
  const { emitEvent } = useSocket(); // Access emitEvent function from the socket context

  const [message, setMessage] = useState<Message>({
    id: "", // Unique message ID
    chatId: "", // Foreign key to the Chat table
    createdBy: user?.uid || "", // User ID of the message creator
    createdAt: Date.now().toLocaleString(), // Timestamp of message creation
    updatedAt: Date.now().toLocaleString(), // Timestamp of message update
    text: "", // Message text
    image: "", // Optional image URL
    audio: "", // Optional audio URL
    video: "", // Optional video URL
    gif: "", // Optional GIF URL
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [mediaPreview, setMediaPreview] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle opening the attachment menu
  const handleOpenAttachmentMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowAttachmentMenu(true);
  };

  // Handle GIF picker
  const handleGifPicker = () => {
    setShowAttachmentMenu(false);
    setAnchorEl(null);
    setShowGifPicker(true);
  };

  // Handle media (image, audio & video) upload
  const handleMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUri = await getMediaFileDataUri(file);
      setMedia(file);
      setMediaPreview(dataUri);
      updateMessage(file.type.split("/")[0], dataUri);
      setShowAttachmentMenu(false);
      setAnchorEl(null);
    }
    event.target.value = "";
    event.target.files = null;
  };

  const menuItems = [
    {
      label: "Image",
      onClick: () => document.getElementById("mediaUpload")?.click(),
      icon: <MdImage />,
    },
    {
      label: "Audio",
      onClick: () => document.getElementById("mediaUpload")?.click(),
      icon: <MdAudioFile />,
    },
    {
      label: "Video",
      onClick: () => document.getElementById("mediaUpload")?.click(),
      icon: <FaFileVideo />,
    },
    { label: "GIF", onClick: handleGifPicker, icon: <MdGifBox /> },
  ];

  // Function to add emojie
  const addEmoji = (emoji: any) => {
    updateMessage("text", message.text + emoji.native);
  };

  // Function to add gif
  const addGif = (gifUrl: string) => {
    console.log(gifUrl);
    setMediaPreview(gifUrl);
    setMedia(new File([], "") as any | null);
    setShowAttachmentMenu(false);
    setAnchorEl(null);
    setShowGifPicker(false);
    updateMessage("gif", gifUrl);
  };

  // Function to handle message field updates
  const updateMessage = (key: string, value: string) => {
    setMessage((prev) => ({
      ...prev,
      id: Date.now().toString(),
      chatId: chatId as string,
      repliedToId: globalMessageState?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      [key]: value,
    }));
  };

  // Function to send the message
  const sendMessage = () => {
    if (
      !message.text?.trim() &&
      !message.image &&
      !message.audio &&
      !message.video &&
      !message.gif?.trim()
    )
      return; // Prevent sending empty messages

    // Set the message state
    setGlobalMessageState(message);

    // Emit the message event
    emitEvent("event:sendMessage", message);

    // Reset the message text field
    setMessage((prev) => ({
      ...prev,
      text: "", // Clear text after sending
      image: "",
      audio: "",
      video: "",
      gif: "",
    }));

    // Reset the media preview & media
    setMediaPreview("");
    setMedia(null);
    setShowReplyPreview(false);
  };

  return (
    <>
      {/* Use the EmojiPicker component */}
      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={addEmoji}
      />
      {/* Use the GifPicker component */}
      <GifPicker
        onGifSelect={addGif}
        open={showGifPicker}
        onClose={() => setShowGifPicker(false)}
      />
      {/* Use the AttachmentMenu component */}
      <AttachmentMenu
        anchorEl={anchorEl}
        open={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        menuItems={menuItems}
      />{" "}
      {/* Load image, audio & video only */}
      <input
        type="file"
        id="mediaUpload"
        accept="audio/*,video/*,image/*"
        style={{ display: "none" }}
        multiple={false}
        onChange={handleMedia}
      />
      {/* Media Preview */}
      <MediaPreview
        mediaSrc={mediaPreview}
        mediaType={media?.type.split("/")[0] as any}
        onClose={() => {
          setMediaPreview("");
          setMedia(new File([], "") as any | null);
        }}
      />
      {/* Chat footer */}
      <div className=" w-full flex justify-between items-center p-2 dark:bg-dark-primary bg-light-primary">
        <div className="flex items-center relative">
          <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FaRegSmile />
          </Button>
          <Button onClick={handleOpenAttachmentMenu}>
            <GrAttachment />
          </Button>
        </div>
        <div className="w-full">
          {/* Reply Preview */}
          <ReplyPreview />
          <TypingBoxWithMic
            message={message}
            updateMessage={updateMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default ChatFooter;
