// src/components/CustomMessageInput.tsx
import { useState } from "react";
import { useChatContext } from "stream-chat-react";

const CustomMessageInput = () => {
  const { channel } = useChatContext();
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!channel) return;
    await channel.sendMessage({ text });
    setText("");
  };

  return (
    <div className="custom-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default CustomMessageInput;
