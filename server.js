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
    console.log("🔍 OpenAI raw response:", JSON.stringify(data, null, 2)); // ✅ LOG THIS

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "OpenAI response invalid", data });
    }

    const answer = data.choices[0].message.content.trim();
    res.json({ answer });

  } catch (error) {
    console.error("❌ OpenAI fetch failed:", error);
    res.status(500).json({ error: "Error contacting OpenAI" });
  }
});
