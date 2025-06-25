const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 8000;
const API_KEY = process.env.OPENROUTER_KEY;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "ChatBot IA Voix"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "Tu es un assistant utile, tu parles toujours en français." },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erreur OpenRouter :", error);
    res.status(500).json({ error: "Erreur serveur ou API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
