const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Give me 5 creative business names and a logo idea for each based on: "${question}"`,
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();

    if (data.generations && data.generations[0]) {
      res.json({ result: data.generations[0].text.trim() });
    } else {
      res.status(500).json({ error: "No response from Cohere" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to contact Cohere API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
