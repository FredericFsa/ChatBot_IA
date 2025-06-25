# 💬 Chat IA avec Voix & Thèmes (Sombre / Clair)

Un assistant intelligent et vocal entièrement localisé en français 🇫🇷, personnalisable, avec prise en charge du mode sombre/clair, et sélection du modèle IA via OpenRouter.

---

## 🧠 Fonctionnalités

- 🤖 Chat IA avec réponses intelligentes (API OpenRouter)
- 🗣️ Synthèse vocale (choix de la voix via Web Speech API)
- 🌓 Thèmes clair / sombre dynamiques
- 🖼️ Splash screen personnalisable
- 🎛️ Sélection du modèle IA à la volée
- 📜 Réponses locales prédéfinies en JSON (`bot_responses.json`)
- 🌐 Serveur Express.js simple pour appels API
- 🔐 Gestion sécurisée de la clé via `.env`

---

## 🖼️ Aperçu

![splash-screen](splash-screen.png)

---

## 🚀 Démarrage rapide

### 📁 Prérequis

- Node.js (v16+)
- Navigateur compatible Web Speech API (Chrome, Edge...)

### ⚙️ Installation

1. Clone le projet :
   ```bash
   git clone <url-du-repo>
   cd <nom-du-repo>
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

3. Crée un fichier `.env` à la racine :
   ```
   OPENROUTER_KEY=ta_clé_api_openrouter
   ```

4. Démarre le serveur :
   ```bash
   node serveur.js
   ```

5. Ouvre `http://localhost:8000` dans ton navigateur.

---

## 🗂️ Structure du projet

```
├── index.html               # Interface utilisateur
├── style_sombre.css         # Thème sombre
├── style_clair.css          # Thème clair
├── splash-screen.png        # Logo d’accueil
├── favicon.ico              # Icône du site
├── .env                     # Clé API privée
├── .gitignore               # Exclusions Git
├── serveur.js               # Serveur Node.js / Express
├── bot_responses.json       # Réponses locales de secours
├── chat_logic_tts.js        # Logique JS + Synthèse vocale
```

---

## 🔧 Personnalisation

- **Ajouter des réponses locales** : édite `bot_responses.json`
- **Changer le logo** : remplace `splash-screen.png`
- **Nouveaux modèles IA** : ajoute-les dans `<select>` de `index.html`
- **Modifier le style** : adapte les fichiers CSS (`style_sombre.css`, `style_clair.css`)

---

## 🔐 Sécurité

- Ne partage jamais ton fichier `.env` contenant ta clé OpenRouter.
- Tu peux l'ajouter à `.gitignore` (déjà prévu).

---

## 📄 Licence

Ce projet est libre de droits pour usage personnel, éducatif ou démonstratif.
