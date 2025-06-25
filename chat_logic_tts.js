let botResponses = {};
let voiceEnabled = true;
let voices = [];
let selectedVoice = null;
let voiceReady = false;

function populateVoiceList() {
  voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voice-select");

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.name.includes("Microsoft Paul")) {
      option.selected = true;
      selectedVoice = voice;
    }
    voiceSelect.appendChild(option);
  });

  voiceSelect.onchange = () => {
    const selectedIndex = parseInt(voiceSelect.value);
    selectedVoice = voices[selectedIndex];
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const test = new SpeechSynthesisUtterance("Voix sélectionnée !");
      test.voice = selectedVoice;
      test.volume = 0;
      window.speechSynthesis.speak(test);
      voiceReady = true;
    }, 100);
  };
}

window.speechSynthesis.onvoiceschanged = () => {
  populateVoiceList();
  voiceReady = true;
};

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("voice-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      voiceEnabled = toggle.checked;
    });
  }

  fetch('bot_responses.json')
    .then(r => r.json())
    .then(data => {
      botResponses = data;
    });
});

function handleInput(e) {
  if (e.key === "Enter") {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    displayMessage("👤", message, "user");

    const lowerMsg = message.toLowerCase();
    const keyMatch = Object.keys(botResponses).find(k => lowerMsg.includes(k));

    if (keyMatch && botResponses[keyMatch]) {
      const reply = botResponses[keyMatch];
      displayMessage("🤖", reply, "bot");
      if (voiceEnabled) speak(reply);
    } else {
      // ✅ Appel via serveur local sécurisé
	  document.getElementById("loading-indicator").style.display = "block";
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
      .then(res => res.json())
      .then(data => {
  console.log("📨 Réponse API :", data); // ← Log utile
  const reply =
    data?.choices?.[0]?.message?.content ||
    data?.response ||
    data?.error?.message ||
    "❌ Réponse invalide du serveur.";
  displayMessage("🤖", reply, "bot");
  if (voiceEnabled) speak(reply);
  document.getElementById("loading-indicator").style.display = "none";
})

      .catch(err => {
        const errorMsg = "Erreur avec le serveur.";
        displayMessage("🤖", errorMsg, "bot");
        if (voiceEnabled) speak(errorMsg);
        console.error("❌ Erreur serveur :", err);

      });
    }
  }
}

function displayMessage(sender, text, cls) {
  const msg = document.createElement("div");
  msg.className = cls;
  msg.textContent = `${sender} ${text}`;
  document.getElementById("messages").appendChild(msg);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

function speak(text) {
  if (!voiceReady || !selectedVoice) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = selectedVoice;
  window.speechSynthesis.speak(utter);
}
