// Import required modules
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Must be v2
require("dotenv").config();

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Load Cohere API key from .env
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// POST /ask endpoint to generate business names
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Give me 5 creative business names and a logo idea for each based on: "${question}"`,
        max_tokens: 200,
        temperature: 0.9
      }),
    });

    const data = await response.json();
    console.log("Cohere response:", data);

    if (data.generations && data.generations.length > 0) {
      res.json({ result: data.generations[0].text.trim() });
    } else {
      res.status(500).json({ error: "No generations returned", data });
    }

  } catch (error) {
    console.error("Error contacting Cohere:", error);
    res.status(500).json({ error: "Cohere API call failed" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ NameEngine backend running on port ${PORT}`);
});
