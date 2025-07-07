const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const corsOptions = {
  origin: "https://ghostwhite-starling-406107.hostingersite.com",
  methods: ["POST"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await openaiRes.json();
    console.log("🔍 OpenAI response:", JSON.stringify(data, null, 2));

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(500).json({ error: "OpenAI did not return an answer", raw: data });
    }

    res.json({ answer });

  } catch (error) {
    console.error("❌ Error during OpenAI call:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
