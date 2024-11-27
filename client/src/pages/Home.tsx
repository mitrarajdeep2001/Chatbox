import Chatbox from "@/components/Chatbox";
import ChatList from "@/components/ChatList";
import { useParams } from "react-router-dom";

const Home = () => {
  const { id } = useParams();
  return (
    <section className="flex h-full">
      <ChatList />
      <Chatbox id={id ? id : null} />
    </section>
  );
};

export default Home;
