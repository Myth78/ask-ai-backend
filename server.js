const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express(); // ✅ must come BEFORE any use of `app`

app.use(cors());
app.use(bodyParser.json());

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
    console.log("OpenAI raw response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "OpenAI response invalid", data });
    }

    const answer = data.choices[0].message.content.trim();
    res.json({ answer });

  } catch (error) {
    console.error("OpenAI fetch failed:", error);
    res.status(500).json({ error: "Server error. Check logs." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
