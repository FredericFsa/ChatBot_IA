# 🤖 Chat IA avec Voix

Un chatbot vocal en français avec prise en charge du thème sombre/clair et intégration API OpenRouter (type ChatGPT).

## 🚀 Fonctionnalités

- 🌗 Bascule dynamique entre thème clair et sombre
- 🧠 Réponses IA via OpenRouter (fallback si pas trouvé dans base locale)
- 🎤 Lecture vocale avec Web Speech API
- 🔐 Clé API sécurisée via `.env`

## 🛠️ Installation

### 1. Clonez le dépôt

```bash
git clone https://github.com/votre-utilisateur/chat-ia-voix.git
cd chat-ia-voix
```

### 2. Dupliquez le fichier d’exemple `.env`

```bash
cp .env.example .env
```

Ajoutez votre clé API dans `.env` :

```
OPENROUTER_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

### 3. Installez les dépendances Node.js

```bash
npm install express dotenv node-fetch
```

### 4. Lancez le serveur

```bash
node serveur.js
```

Ouvrez ensuite dans votre navigateur : [http://localhost:8000](http://localhost:8000)

## 🧠 API OpenRouter

Créez une clé ici : [https://openrouter.ai](https://openrouter.ai)

## 📁 Structure du projet

- `index.html` : interface web
- `style_clair.css` / `style_sombre.css` : thèmes
- `chat_logic_tts.js` : logique client
- `serveur.js` : serveur Node.js (proxy API)
- `.env` : stocke la clé API (non publié)
