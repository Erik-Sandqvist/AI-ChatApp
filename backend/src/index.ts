import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Skapa Stream server client
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

// Test endpoint för health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Endpoint för att generera user token
app.post("/token", async (req, res) => {
  const { userId, userName } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    // Skapa token
    const token = serverClient.createToken(userId);

    // Skapa användare på servern om den inte finns
    await serverClient.upsertUser({
      id: userId,
      name: userName || userId,
      image: `https://getstream.io/random_png/?name=${userName || userId}`,
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
