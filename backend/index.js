require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { StreamChat } = require("stream-chat");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_SECRET_KEY
);

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;

  try {
    // Create or retrieve the user
    const token = serverClient.createToken(username);
    await serverClient.upsertUser({ id: username, name: username });

    res.json({ username, token });
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
