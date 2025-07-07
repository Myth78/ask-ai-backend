const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
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
    const answer = data.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: "OpenAI API call failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
