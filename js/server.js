const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

const verify = document.getElementById("verify");
const invite = document.getElementById("invite");
const panel = document.getElementById("panel");

const serverName = document.getElementById("serverName");
const serverIcon = document.getElementById("serverIcon");
const inviteLink = document.getElementById("inviteLink");

if (!guildId) {
  verify.innerHTML = "<h2>Invalid server</h2>";
  throw new Error("Missing guild ID");
}

// Smooth UX delay
setTimeout(checkServer, 1200);

async function checkServer() {
  const res = await fetch(
    `/.netlify/functions/checkBot?guild=${guildId}`
  );

  const data = await res.json();

  verify.style.display = "none";

  if (data.botInServer) {
    // Show minimal panel
    panel.style.display = "block";

    serverName.textContent = data.guild.name;

    if (data.guild.icon) {
      serverIcon.src =
        `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
    }

  } else {
    // Show invite screen
    invite.style.display = "flex";
    inviteLink.href =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${process.env.CLIENT_ID || ""}` +
      `&scope=bot%20applications.commands` +
      `&permissions=8` +
      `&guild_id=${guildId}` +
      `&disable_guild_select=true`;
  }
}
