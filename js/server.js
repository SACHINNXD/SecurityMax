console.log("🔥 THIS IS THE NEW SERVER.JS");

const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

console.log("Guild ID:", guildId);

const verifyEl = document.getElementById("verify");
const inviteEl = document.getElementById("invite");
const panelEl = document.getElementById("panel");
const inviteLink = document.getElementById("inviteLink");

// Safety helper
function showOnly(element) {
  [verifyEl, inviteEl, panelEl].forEach(el => {
    if (el) el.style.display = "none";
  });
  if (element) element.style.display = "block";
}

async function verifyServer() {
  if (!guildId) {
    console.error("Missing guild ID");
    showOnly(inviteEl);
    return;
  }

  try {
    const res = await fetch(`/.netlify/functions/checkBot?guild=${guildId}`);
    console.log("Status:", res.status);

    const data = await res.json();
    console.log("Response text:", data);

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

    // BOT IS IN SERVER
    showOnly(panelEl);

    // OPTIONAL: set title safely
    if (data.guild?.name) {
      document.title = `${data.guild.name} | Security Max`;
    }

  } catch (err) {
    console.error("Verification error:", err);
    showOnly(inviteEl);
  }
}

// Start verification
verifyServer();
