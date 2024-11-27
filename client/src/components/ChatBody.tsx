const ChatBody = ({ chatData }: { chatData: object | null }) => {
  console.log(chatData, "chatData");
  return (
    <div className="h-[83%] dark:bg-chat_doodles_dark bg-chat_doodles_light bg-[length:1200px] bg-no-repeat bg-center p-5 flex flex-col gap-10 overflow-y-auto">
      <div className="min-w-[12%] max-w-[30%] min-h-[5%] max-h-[20%] inline-flex flex-col dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md">
        <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary">
          <p className="text-sm dark:text-light-primary text-dark-primary">
            hello
          </p>
        </div>
        <p className="text-sm dark:text-light-primary text-dark-primary">
          hello
        </p>
        <div className="self-end text-xs">
          <span className="dark:text-dark-chat_tertiary text-light-chat_tertiary">
            12:00
          </span>
          <span></span>
        </div>
      </div>
      <div className="min-w-[12%] max-w-[30%] min-h-[5%] max-h-[20%] inline-flex flex-col dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md self-end">
        <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary">
          <p className="text-sm dark:text-light-primary text-dark-primary">
            hello
          </p>
        </div>
        <p className="text-sm dark:text-light-primary text-dark-primary">
          hello
        </p>
        <div className="self-end text-xs">
          <span className="dark:text-dark-chat_tertiary text-light-chat_tertiary">
            12:00
          </span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
