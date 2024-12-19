import { useAuth } from "@/context/AuthProvider";
import { Message } from "@/lib/types";
import { formatTimeWithAmPm } from "@/lib/utils";

const MessageBody = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  console.log(message, "MessageBody");
  return (
    <div
      className={`${
        message.image || message.gif || message.audio || message.video
          ? "min-w-[25%]"
          : "min-w-[20%]"
      } max-w-[60%] inline-flex flex-col gap-2 dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md relative ${
        message.createdBy === user?.uid ? "self-end" : "self-start"
      }`}
    >
      {/* preview message */}
      <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary">
        <p className="text-sm dark:text-light-primary text-dark-primary">
          hello
        </p>
      </div>
      {/* original message */}
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
      <div className="text-xs w-full">
        {message.text && (
          <p className="text-sm text-left dark:text-light-primary text-dark-primary">
            {message.text}
          </p>
        )}
        {/* messaged at */}
        <p className="dark:text-dark-chat_tertiary text-light-chat_tertiary text-right w-full">
          {formatTimeWithAmPm(message?.createdAt)}
        </p>
        <span></span>
      </div>
    </div>
  );
};

export default MessageBody;
