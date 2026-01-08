console.log("🔥 THIS IS THE NEW SERVER.JS");

const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

console.log("Guild ID:", guildId);

// Elements
const verifyEl = document.getElementById("verify");
const inviteEl = document.getElementById("invite");
const panelEl = document.getElementById("panel");

// GENERAL ENABLE UI (must exist in HTML)
const enableToggle = document.getElementById("enableToggle");
const savePopup = document.getElementById("savePopup");
const saveBtn = document.getElementById("saveBtn");
const discardBtn = document.getElementById("discardBtn");

// State
let enabled = false;
let dirty = false;

// Helper
function showOnly(el) {
  [verifyEl, inviteEl, panelEl].forEach(e => e && (e.style.display = "none"));
  if (el) el.style.display = "block";
}

// Load saved settings
async function loadSettings() {
  const res = await fetch(
    `/.netlify/functions/getSettings?guildId=${guildId}`
  );
  const data = await res.json();

  enabled = data.enabled;
  updateToggle();
}

// Toggle UI
function updateToggle() {
  enableToggle.classList.toggle("on", enabled);
}

// Toggle click
enableToggle.addEventListener("click", () => {
  enabled = !enabled;
  dirty = true;
  updateToggle();
  savePopup.classList.add("show");
});

// Save
saveBtn.addEventListener("click", async () => {
  await fetch("/.netlify/functions/saveSettings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guildId,
      enabled,
    }),
  });

  dirty = false;
  savePopup.classList.remove("show");
});

// Discard
discardBtn.addEventListener("click", () => {
  dirty = false;
  loadSettings();
  savePopup.classList.remove("show");
});

// Block navigation if unsaved
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", e => {
    if (dirty) {
      savePopup.classList.add("shake");
      setTimeout(() => savePopup.classList.remove("shake"), 400);
      e.stopImmediatePropagation();
    }
  });
});

// VERIFY SERVER (existing logic preserved)
async function verifyServer() {
  if (!guildId) {
    showOnly(inviteEl);
    return;
  }

  try {
    const res = await fetch(`/.netlify/functions/checkBot?guild=${guildId}`);
    const data = await res.json();

    if (!data.botInServer) {
      showOnly(inviteEl);
      return;
    }

    showOnly(panelEl);
    loadSettings();
  } catch {
    showOnly(inviteEl);
  }
}

verifyServer();
