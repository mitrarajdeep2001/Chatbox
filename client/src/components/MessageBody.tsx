import { useAuth } from "@/context/AuthProvider";
import { Message } from "@/lib/types";
import { formatTimeWithAmPm } from "@/lib/utils";

const MessageBody = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  console.log(message, "MessageBody");
  return (
    <div
      className={`min-w-[20%] max-w-[60%] inline-flex flex-col gap-2 dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md ${
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
      <p className="text-sm dark:text-light-primary text-dark-primary">
        {message.text}
      </p>
      <div className="self-end text-xs">
        {/* messaged at */}
        <span className="dark:text-dark-chat_tertiary text-light-chat_tertiary">
          {formatTimeWithAmPm(message?.createdAt)}
        </span>
        <span></span>
      </div>
    </div>
  );
};

export default MessageBody;
