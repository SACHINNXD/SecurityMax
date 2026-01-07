console.log("THIS IS THE NEW SERVER.JS");

// ---------- HELPERS ----------
const qs = (id) => document.getElementById(id);

// ---------- ELEMENTS ----------
const verifyEl = qs("verify");
const inviteEl = qs("invite");
const panelEl = qs("panel");

const serverNameEl = qs("serverName");
const serverIconEl = qs("serverIcon");
const inviteLinkEl = qs("inviteLink");

// ---------- GET GUILD ID ----------
const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

console.log("Guild ID:", guildId);

if (!guildId) {
  showError("Missing guild ID");
  throw new Error("Missing guild ID");
}

// ---------- VERIFY BOT ----------
fetch(`/.netlify/functions/checkBot?guild=${guildId}`)
  .then(async (res) => {
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);

    if (!res.ok) throw new Error("Request failed");

    return JSON.parse(text);
  })
  .then((data) => {
    // STOP LOADER
    verifyEl.style.display = "none";

    if (data.botInServer === true) {
      // ---------- BOT IS IN SERVER ----------
      panelEl.style.display = "block";

      serverNameEl.textContent = data.guild.name;

      if (data.guild.icon) {
        serverIconEl.src = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=128`;
      } else {
        serverIconEl.src = "/assets/logo.png";
      }
    } else {
      // ---------- BOT NOT IN SERVER ----------
      inviteEl.style.display = "flex";

      inviteLinkEl.href =
        `https://discord.com/oauth2/authorize` +
        `?client_id=1457942798644019349` +
        `&scope=bot%20applications.commands` +
        `&permissions=8` +
        `&guild_id=${guildId}` +
        `&disable_guild_select=true`;
    }
  })
  .catch((err) => {
    console.error("Verification error:", err);
    showError("Verification failed. Please refresh or try again.");
  });

// ---------- ERROR HANDLER ----------
function showError(message) {
  verifyEl.style.display = "none";
  inviteEl.style.display = "none";
  panelEl.style.display = "none";

  const div = document.createElement("div");
  div.className = "center";
  div.innerHTML = `<h2>${message}</h2>`;
  document.body.appendChild(div);
}
