const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

// Elements
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

// Small delay for UX
setTimeout(checkServer, 1000);

async function checkServer() {
  try {
    // ✅ CORRECT FUNCTION PATH
    const res = await fetch(
      `/.netlify/functions/checkBot?guild=${guildId}`
    );

    if (!res.ok) {
      verify.innerHTML =
        "<h2>Verification failed</h2><p>Please refresh or try again later.</p>";
      return;
    }

    const data = await res.json();

    // Stop loading
    verify.style.display = "none";

    // ✅ BOT IS IN SERVER
    if (data.botInServer) {
      panel.style.display = "block";

      serverName.textContent = data.guild.name;

      if (data.guild.icon) {
        serverIcon.src =
          `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
      } else {
        serverIcon.style.display = "none";
      }

      return;
    }

    // ❌ BOT NOT IN SERVER
    invite.style.display = "flex";
    inviteLink.href =
      `https://discord.com/oauth2/authorize` +
      `?client_id=1457942798644019348` +
      `&scope=bot%20applications.commands` +
      `&permissions=8` +
      `&guild_id=${guildId}` +
      `&disable_guild_select=true`;

  } catch (err) {
    console.error(err);
    verify.innerHTML =
      "<h2>Unexpected error</h2><p>Please try again.</p>";
  }
}
