const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// ✅ CORS configuration to allow Vercel frontend
const corsOptions = {
  origin: "https://ask-ai-green.vercel.app", // ✅ Your frontend domain
  methods: ["POST"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ POST endpoint for the AI question
app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
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
    console.error("❌ OpenAI fetch failed:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
