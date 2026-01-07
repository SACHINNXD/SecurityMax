const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

const verifyEl = document.getElementById("verify");
const inviteEl = document.getElementById("invite");
const panelEl = document.getElementById("panel");
const inviteLink = document.getElementById("inviteLink");

if (!guildId) {
  verifyEl.innerHTML = "<h2>Invalid server</h2>";
  throw new Error("Missing guild ID");
}

// Fake delay for smooth UX
setTimeout(checkBot, 1500);

async function checkBot() {
  const res = await fetch(
    `/.netlify/functions/checkBot?guild=${guildId}`,
    { credentials: "include" }
  );

  const data = await res.json();

  verifyEl.style.display = "none";

  if (!data.loggedIn) {
    window.location.href = "/";
    return;
  }

  if (data.botInServer) {
    panelEl.style.display = "block";
  } else {
    inviteEl.style.display = "flex";
    inviteLink.href =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${data.clientId}` +
      `&scope=bot%20applications.commands` +
      `&permissions=8` +
      `&guild_id=${guildId}` +
      `&disable_guild_select=true`;
  }
}
