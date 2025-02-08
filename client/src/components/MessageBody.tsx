import { useAuth } from "@/context/AuthProvider";
import { Message } from "@/lib/types";
import { formatTimeWithAmPm } from "@/lib/utils";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { FiClock } from "react-icons/fi";
import { LuReply } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider"; // Assuming you have a SocketProvider
import { useIntersectionObserver } from "@/lib/hooks";
import { useGeneralContext } from "@/context/GeneralProvider";

const MessageBody = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  const { emitEvent, listenToEvent } = useSocket(); // Get socket instance
  const {setShowReplyPreview, setGlobalMessageState} = useGeneralContext();

  const [readMessages, setReadMessages] = useState<Set<string>>(new Set()); // Store read messageIds
  const [messageStatus, setMessageStatus] = useState(message.status || "sent"); // Track message status
  const [showActionButtons, setShowActionButtons] = useState(false); // Show action buttons

  // Function to check if event should fire
  const shouldFireEvent = () =>
    !readMessages.has(message.id) && message.status !== "read";

  // Handle read event
  const handleRead = () => {
    if (message.createdBy !== user?.uid) {
      emitEvent("event:messageRead", {
        messageId: message.id,
        roomId: message.chatId,
        userId: user?.uid,
      });
      console.log("Message read event fired.", message.id);

      // Mark message as read in state (so it doesn't fire again)
      setReadMessages((prev) => new Set(prev).add(message.id));
    }
  };

  // Attach Intersection Observer
  const messageRef = useIntersectionObserver(handleRead, shouldFireEvent);

  useEffect(() => {
    listenToEvent("event:messageRead", (data) => {
      console.log("Message read event received.", data);
      if (data.messageId !== message.id) {
        return;
      }
      setMessageStatus("read");
      setReadMessages((prev) => new Set(prev).add(data.messageId));
    });

    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleReply = () => {
    setShowReplyPreview(true);
    setGlobalMessageState({...message, isReplyPreview: true});
  }

  return (
    <div
      ref={messageRef} // Attach observer to this div
      className={`${
        message.image || message.gif || message.audio || message.video
          ? "min-w-[25%]"
          : "min-w-[20%]"
      } max-w-[60%] flex items-center justify-end gap-2 cursor-default relative ${
        message.createdBy === user?.uid
          ? "self-end"
          : "self-start flex-row-reverse"
      }`}
      onMouseOver={() => setShowActionButtons(true)}
      onMouseLeave={() => setShowActionButtons(false)}
    >
      {/* Reply Icon */}
      {showActionButtons && (
        <button onClick={handleReply}>
          <LuReply className="text-dark-tertiary dark:text-light-tertiary" />
        </button>
      )}
      <div className="dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md">
        {/* Preview message */}
        {message.repliedTo && (
          <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary">
            <h6 className="dark:text-light-primary text-dark-primary text-xs">
              {message.repliedTo?.creator?.id === user?.uid
                ? "You"
                : message.repliedTo?.creator?.name}
            </h6>
            <p className="text-sm dark:text-light-primary text-dark-primary">
              {message.repliedTo?.text}
            </p>
            {/* Media Content */}
            {(message.repliedTo?.image || message.repliedTo?.gif) && (
              <img
                className="rounded-md max-h-32 w-full"
                src={message.repliedTo?.image || message.repliedTo?.gif || ""}
                alt=""
              />
            )}
            {message.repliedTo?.audio && (
              <audio
                className="rounded-md max-h-32 w-full"
                controls
                src={message.repliedTo.audio}
              />
            )}
            {message.repliedTo?.video && (
              <video
                className="rounded-md max-h-32 w-full"
                controls
                src={message.repliedTo.video}
              />
            )}
          </div>
        )}
        {/* Original message */}
        <div className="dark:bg-dark-chat_primary bg-light-chat_primary rounded-md ">
          <p className="dark:text-light-primary text-dark-primary">
            {message.text}
          </p>
        </div>
        {/* Media Content */}
        {(message.image || message.gif) && (
          <img
            className="rounded-md max-h-32 w-full"
            src={message.image || message.gif || ""}
            alt=""
          />
        )}
        {message.audio && (
          <audio
            className="rounded-md max-h-32 w-full"
            controls
            src={message.audio}
          />
        )}
        {message.video && (
          <video
            className="rounded-md max-h-32 w-full"
            controls
            src={message.video}
          />
        )}

        {/* Message Footer */}
        <div className="text-xs w-full">
          <div className="flex gap-2 items-center">
            {/* Time */}
            <p className="dark:text-dark-chat_tertiary text-light-chat_tertiary text-right w-full">
              {formatTimeWithAmPm(message.updatedAt)}
            </p>
            {/* Status Icons */}
            {message.createdBy === user?.uid &&
              (messageStatus === "sent" ? (
                <DoneIcon sx={{ fontSize: 15, color: "grey !important" }} />
              ) : messageStatus === "delivered" ? (
                <DoneAllIcon sx={{ fontSize: 15, color: "grey !important" }} />
              ) : messageStatus === "read" ? (
                <DoneAllIcon
                  sx={{ fontSize: 15, color: "rgb(147 147 194) !important" }}
                />
              ) : (
                <FiClock className="text-light-chat_tertiary dark:text-dark-chat_tertiary" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBody;
