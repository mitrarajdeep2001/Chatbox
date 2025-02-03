import { useSocket } from "@/context/SocketProvider";
import { Chat, Message } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBody from "./MessageBody";
import { fetchData } from "@/lib/api";
import { useGeneralContext } from "@/context/GeneralProvider";

const ChatBody = ({ chatData }: { chatData: Chat | null }) => {
  const { listenToEvent } = useSocket(); // Access socket methods
  const [messages, setMessages] = useState<Message[]>([]); // State to store messages
  const [page, setPage] = useState(1); // Track the page for pagination

  const { globalMessageState: message } = useGeneralContext();
  const scrollRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Listen for new incoming messages
  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);
  useEffect(() => {

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

  const getMessages = useCallback(async () => {
    if (chatData) {
      const newMessages = await fetchData<Message[]>(`/message`, {
        chatId: chatData.id,
        page,
        limit: 10,
      });
      if (page === 1) {
        setMessages(newMessages);
      } else {
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      }
    }
  }, [chatData, page]);

  useEffect(() => {
    getMessages();
  }, [getMessages]); // Add new messages at the top and reverse the order

  // Handle scroll event for loading more messages
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      // Check if user has scrolled to the top
      const isAtTop = scrollRef.current.scrollTop === 0;
      if (isAtTop && messages.length > 0) {
        console.log("Fetching more messages...");

        // Fetch more messages by increasing the page number
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, []); // Attach scroll event listener to the scrollRef

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Reattach scroll event listener whenever new messages are fetched

  return (
    <div
      ref={scrollRef}
      className="h-[83%] dark:bg-chat_doodles_dark bg-chat_doodles_light bg-[length:1200px] bg-no-repeat bg-center p-5 flex flex-col items-center gap-5 overflow-y-auto"
    >
      <p className="dark:text-light-primary text-dark-primary dark:bg-dark-chat_primary bg-light-chat_primary p-2 rounded-md text-sm text-center w-80 opacity-50">
        Messages are end-to-encrypted.
      </p>
      {messages.length > 0
        ? messages.map((message, index) => (
            <MessageBody key={index} message={message} />
          ))
        : null}
    </div>
  );
};

export default ChatBody;
