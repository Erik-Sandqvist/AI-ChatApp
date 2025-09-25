import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export function generateUserToken(userId: string) {
  return serverClient.createToken(userId);
}
