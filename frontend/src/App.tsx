import { useEffect, useState } from "react";
import CustomChannelHeader from "./components/CustomChannelHeader";
import CustomMessageList from "./components/CustomMessageList";
import { CustomMessageInput } from './components/CustomMessageInput';
import { ChannelData } from "stream-chat";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

// Miljövariabler
const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const userId = import.meta.env.VITE_STREAM_USER_ID;
const userName = import.meta.env.VITE_STREAM_USER_NAME;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const client = StreamChat.getInstance(apiKey);

const App = () => {
  const [channel, setChannel] = useState<any>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hämta token från backend
  useEffect(() => {
    const fetchToken = async (userId: string) => {
      try {
        console.log("🔑 Fetching token for user:", userId);
        const res = await fetch(`${backendUrl}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName }),
        });

        const text = await res.text();
        if (!res.ok) {
          console.error("❌ Token endpoint error:", res.status, text);
          throw new Error(`Token fetch failed: ${res.status}`);
        }

        const data = JSON.parse(text);
        console.log("✅ Got token:", data.token);
        setUserToken(data.token); // <-- här sätter vi token i state
      } catch (err) {
        console.error("❌ fetchToken failed:", err);
      }
    };

    fetchToken(userId);
  }, []);

  // Connecta användaren när token finns
  useEffect(() => {
    if (!userToken) return;

    const connectAndInit = async () => {
      try {
        console.log("🔌 Connecting user:", userId);
        await client.connectUser(
          { id: userId, name: userName, image: `https://getstream.io/random_png/?name=${userName}` },
          userToken
        );
        console.log("✅ User connected to Stream");

        const ch = client.channel("messaging", "my_channel", {
          members: [userId],
          // @ts-ignore: name är tillåtet av API:t men saknas i typerna
          name: "My Chat Channel",
        });

        await ch.watch();
        console.log("✅ Channel ready:", ch.id);

        setChannel(ch);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to connect or init channel:", err);
      }
    };

    connectAndInit();

    return () => {
      client.disconnectUser();
    };
  }, [userToken]);

  if (loading) return <div>Loading chat...</div>;
  if (!channel) return <div>Failed to load channel</div>;

  return (
    <Chat client={client} theme="dark">
      <Channel channel={channel}>
        <CustomChannelHeader />
        <CustomMessageList />
        <CustomMessageInput />
      </Channel>
    </Chat>
  );
};

export default App;
