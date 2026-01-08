console.log("🔥 THIS IS THE NEW SERVER.JS");

const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

console.log("Guild ID:", guildId);

const verifyEl = document.getElementById("verify");
const inviteEl = document.getElementById("invite");
const panelEl = document.getElementById("panel");
const inviteLink = document.getElementById("inviteLink");

const toggle = document.getElementById("enableToggle");
const popup = document.getElementById("savePopup");
const saveBtn = document.getElementById("saveBtn");
const discardBtn = document.getElementById("discardBtn");

let currentEnabled = false;
let pendingEnabled = false;
let hasUnsavedChanges = false;

/* ================= HELPERS ================= */

function showOnly(element) {
  [verifyEl, inviteEl, panelEl].forEach(el => {
    if (el) el.style.display = "none";
  });
  if (element) element.style.display = "block";
}

function showPopup() {
  popup.classList.add("show");
}

function hidePopup() {
  popup.classList.remove("show");
}

/* ================= VERIFY SERVER ================= */

async function verifyServer() {
  if (!guildId) {
    console.error("Missing guild ID");
    showOnly(inviteEl);
    return;
  }

  try {
    const res = await fetch(`/.netlify/functions/checkBot?guild=${guildId}`);
    const data = await res.json();

    if (!data.botInServer) {
      inviteLink.href =
        `https://discord.com/oauth2/authorize` +
        `?client_id=1457942798644019349` +
        `&permissions=8` +
        `&scope=bot%20applications.commands` +
        `&guild_id=${guildId}`;

      showOnly(inviteEl);
      return;
    }

    showOnly(panelEl);
    loadSettings();

  } catch (err) {
    console.error("Verification error:", err);
    showOnly(inviteEl);
  }
}

/* ================= LOAD SETTINGS ================= */

async function loadSettings() {
  try {
    const res = await fetch(`/.netlify/functions/getSettings?guild=${guildId}`);
    const data = await res.json();

    currentEnabled = !!data.enabled;
    pendingEnabled = currentEnabled;

    toggle.classList.toggle("on", currentEnabled);
  } catch (e) {
    console.error("Failed to load settings", e);
  }
}

/* ================= TOGGLE ================= */

toggle.addEventListener("click", () => {
  pendingEnabled = !pendingEnabled;
  toggle.classList.toggle("on", pendingEnabled);

  hasUnsavedChanges = pendingEnabled !== currentEnabled;
  if (hasUnsavedChanges) showPopup();
});

/* ================= SAVE ================= */

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("/.netlify/functions/saveSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guildId,
        enabled: toggleEnabled
      })
    });

    if (!res.ok) {
      throw new Error("Save failed");
    }

    console.log("Settings saved");
    hideSavePopup();
    hasUnsavedChanges = false;

  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save settings");
  }
});


/* ================= DISCARD ================= */

discardBtn.addEventListener("click", () => {
  pendingEnabled = currentEnabled;
  toggle.classList.toggle("on", currentEnabled);
  hasUnsavedChanges = false;
  hidePopup();
});

/* ================= START ================= */

verifyServer();
