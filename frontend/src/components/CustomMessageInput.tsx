import e from "express";
import { useState, FormEvent } from "react";
import { useChannelActionContext } from "stream-chat-react";

export const CustomMessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage } = useChannelActionContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMessage({ text } as any); // <-- 'as any' löser typfelet
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default CustomMessageInput;