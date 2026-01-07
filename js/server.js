// ===============================
// Server Verification Logic
// ===============================

const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

// DOM elements
const verify = document.getElementById("verify");
const invite = document.getElementById("invite");
const panel = document.getElementById("panel");

const serverName = document.getElementById("serverName");
const serverIcon = document.getElementById("serverIcon");
const inviteLink = document.getElementById("inviteLink");

// -------------------------------
// Validate guild ID
// -------------------------------
if (!guildId) {
  verify.innerHTML = "<h2>Invalid server</h2><p>No guild ID provided.</p>";
  throw new Error("Missing guild ID");
}

// -------------------------------
// Start verification (smooth UX)
// -------------------------------
setTimeout(checkServer, 1200);

// -------------------------------
// Main verification function
// -------------------------------
async function checkServer() {
  try {
    const res = await fetch(
      `/.netlify/functions/checkBot?guild=${guildId}`
    );

    // If Netlify function failed
    if (!res.ok) {
      verify.innerHTML =
        "<h2>Verification failed</h2><p>Please refresh or try again later.</p>";
      return;
    }

    // Safely parse JSON
    let data;
    try {
      data = await res.json();
    } catch (err) {
      verify.innerHTML =
        "<h2>Server error</h2><p>Invalid response from server.</p>";
      return;
    }

    // Stop spinner
    verify.style.display = "none";

    // -------------------------------
    // Bot is in the server
    // -------------------------------
    if (data.botInServer) {
      panel.style.display = "block";

      serverName.textContent = data.guild?.name || "Server";

      if (data.guild?.icon) {
        serverIcon.src =
          `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
      } else {
        serverIcon.style.display = "none";
      }

      return;
    }

    // -------------------------------
    // Bot NOT in server → Invite
    // -------------------------------
    invite.style.display = "flex";

    inviteLink.href =
      `https://discord.com/oauth2/authorize` +
      `?client_id=1457942798644019348` +
      `&scope=bot%20applications.commands` +
      `&permissions=8` +
      `&guild_id=${guildId}` +
      `&disable_guild_select=true`;

  } catch (err) {
    console.error("Verification error:", err);
    verify.innerHTML =
      "<h2>Unexpected error</h2><p>Please try again.</p>";
  }
}
