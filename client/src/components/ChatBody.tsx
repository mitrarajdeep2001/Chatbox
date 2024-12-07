import { useSocket } from "@/context/SocketProvider";
import { Message } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageBody from "./MessageBody";
import { useLocalState } from "@/lib/hooks";

const ChatBody = ({ chatData }: { chatData: object | null }) => {
  const { id: chatId } = useParams(); // Chat ID from route params
  const { listenToEvent, emitEvent, socket } = useSocket(); // Access socket methods
  const [messages, setMessages] = useState<any[]>([]); // State to store messages
  const { state: message } = useLocalState("message");
  const scrollRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Fetch initial messages when chatId changes
  // useEffect(() => {
  //   if (chatId) {
  //     emitEvent("event:fetchMessages", { chatId }); // Request initial messages

  //     listenToEvent("event:initialMessages", (initialMessages: Message[]) => {
  //       setMessages(initialMessages);
  //     });
  //   }

  //   // Clean up event listeners on unmount
  //   return () => {
  //     listenToEvent("event:initialMessages", () => {}); // Remove listener
  //   };
  // }, [chatId, emitEvent, listenToEvent]);

  // Listen for new incoming messages
  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    listenToEvent("event:newMessage", handleNewMessage);

    return () => {
      listenToEvent("event:newMessage", handleNewMessage); // Remove listener
    };
  }, [listenToEvent]);

  useEffect(() => {
    if (message) {
      setMessages((prevMessages: any) => [...prevMessages, message]);
    }
  }, [message]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="h-[83%] dark:bg-chat_doodles_dark bg-chat_doodles_light bg-[length:1200px] bg-no-repeat bg-center p-5 flex flex-col gap-5 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageBody key={index} message={message} />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ChatBody;
