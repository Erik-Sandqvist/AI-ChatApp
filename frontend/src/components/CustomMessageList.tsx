// src/components/CustomMessageList.tsx
import { useChannelStateContext } from "stream-chat-react";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

const Message = ({ message }: any) => {
  const isMine = message.user?.id === client.userID;

  return (
    <div className={`custom-message ${isMine ? "mine" : ""}`}>
      <p>{message.text}</p>
      <small>{message.user?.name}</small>
    </div>
  );
};

const CustomMessageList = () => {
  const { messages } = useChannelStateContext();

  if (!messages) return <div>Loading messages...</div>; // <-- Säkerhetskontroll

  return (
    <div className="custom-message-list">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default CustomMessageList;
