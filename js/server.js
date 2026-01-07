// ===================================================================
// Security Max – Server Panel Script
// FULL FILE – SAFE TO REPLACE
// ===================================================================

const root = document.getElementById("server-root");
const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

if (!guildId) {
  root.innerHTML = "<h2>Invalid server</h2>";
  throw new Error("Missing guild ID");
}

// Simulated verification delay (3.5s)
setTimeout(checkServer, 3500);

async function checkServer() {
  try {
    const res = await fetch(
      `/.netlify/functions/checkBot?guild=${guildId}`,
      { credentials: "include" }
    );

    if (!res.ok) {
      root.innerHTML = "<h2>Access denied</h2>";
      return;
    }

    const data = await res.json();

    if (data.inServer) {
      showPanel(data.serverName);
    } else {
      showInvite(data.invite);
    }

  } catch (err) {
    root.innerHTML = "<h2>Something went wrong</h2>";
  }
}

function showPanel(serverName) {
  root.innerHTML = `
    <h2>${serverName}</h2>
    <p>Security Max is active in this server.</p>

    <div class="panel">
      <button>Anti-Raid</button>
      <button>Moderation</button>
      <button>Logs</button>
    </div>
  `;
}

function showInvite(invite) {
  root.innerHTML = `
    <h2>Bot is not in this server</h2>
    <p>Invite Security Max Bot to continue.</p>

    <a class="invite-btn" href="${invite}" target="_blank">
      Invite Security Max Bot
    </a>
  `;
}
