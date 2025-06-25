
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("❌ Clé API manquante dans le fichier .env !");
    process.exit(1);
}

console.log("🔐 Clé API chargée : [OK]");

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const modelsToTest = [
    "mistralai/mistral-7b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "mistralai/mixtral-8x7b-instruct",
    "nousresearch/nous-hermes-2-mixtral-8x7b-dpo"
];

let selectedModel = null;

async function findWorkingModel(userMessage) {
    for (const model of modelsToTest) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:8000",
                    "X-Title": "ChatBot IA Hybride"
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: "Tu es un assistant IA amical, précis et clair. Tu parles toujours en français. Lorsque l'utilisateur donne une réponse courte comme 'oui', 'non', 'alors', demande-lui de préciser sa pensée ou pose une question pour l'aider." },
                        { role: "user", content: userMessage }
                    ]
                })
            });

            const data = await response.json();
			console.log("📨 Réponse brute d'OpenRouter :", JSON.stringify(data, null, 2));
            if (response.ok && data.choices) {
                console.log(`✅ Modèle sélectionné : ${model}`);
                return model;
            } else {
                console.warn(`⚠️ Échec avec ${model} :`, data.error?.message || "Réponse non valide");
            }
        } catch (err) {
            console.warn(`❌ Erreur avec ${model} :`, err.message);
        }
    }
    return null;
}

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;
    const userModelChoice = req.body.model?.trim();
    if (userModelChoice) {
        selectedModel = userModelChoice;
        console.log("📌 Modèle imposé par l'utilisateur :", selectedModel);
    }

    if (!userMessage || userMessage.trim().length < 5) {
        return res.json({ response: "Peux-tu préciser ce que tu veux dire ?" });
    }

    if (!selectedModel) {
        selectedModel = await findWorkingModel(userMessage || "Bonjour");
        if (!selectedModel) {
            return res.status(500).json({ error: "Aucun modèle valide trouvé pour l'instant." });
        }
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "ChatBot IA Hybride"
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    { role: "system", content: "Tu es un assistant IA amical, précis et clair. Tu parles toujours en français. Lorsque l'utilisateur donne une réponse courte comme 'oui', 'non', 'alors', demande-lui de préciser sa pensée ou pose une question pour l'aider." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        if (response.ok && data.choices && data.choices[0]) {
            res.json({ response: data.choices[0].message.content });
        } else {
            
            console.warn("🔁 Erreur avec le modèle courant, tentative avec les autres...");
            selectedModel = await findWorkingModel(userMessage);
            if (!selectedModel) {
                return res.status(500).json({ error: "Aucun modèle disponible même après nouvelle tentative.", details: data });
            }
            return res.json({ response: "Le modèle précédent a échoué. Je suis de retour avec un autre modèle. Peux-tu reformuler ta question ?" });
    
        }
    } catch (err) {
        console.error("❌ Erreur serveur :", err.message);
        res.status(500).json({ error: "Erreur serveur", message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
