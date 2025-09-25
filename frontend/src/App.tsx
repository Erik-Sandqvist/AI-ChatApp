import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

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
    const fetchToken = async () => {
      try {
        const res = await fetch(`${backendUrl}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName }),
        });
        const data = await res.json();
        setUserToken(data.token);
      } catch (err) {
        console.error("Failed to fetch token:", err);
      }
    };

    fetchToken();
  }, []);

  // Connecta användaren när token finns
  useEffect(() => {
    if (!userToken) return;

    client.connectUser(
      { id: userId, name: userName, image: `https://getstream.io/random_png/?name=${userName}` },
      userToken
    );

    const initChannel = async () => {
      const ch = client.channel(
        "messaging",
        "my_channel",
        {
          members: [userId],
        } as any // <-- fixar TypeScript-felet med name
      );

      await ch.watch();
      setChannel(ch);
      setLoading(false);
    };

    initChannel();

    return () => {
      client.disconnectUser();
    };
  }, [userToken]);

  if (loading) return <div>Loading chat...</div>;
  if (!channel) return <div>Failed to load channel</div>;

  return (
    <Chat client={client} theme="light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default App;
