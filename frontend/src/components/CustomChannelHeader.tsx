// src/components/CustomChannelHeader.tsx
import { useChannelStateContext } from "stream-chat-react";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();

  return (
    <div className="custom-header">
      <h2>{(channel?.data as { name?: string })?.name || "Unnamed channel"}</h2>
      <span>{String(channel?.state?.members?.size || 0)} members</span>
    </div>
  );
};

export default CustomChannelHeader;
