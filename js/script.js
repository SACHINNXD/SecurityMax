// ===================================================================
// Security Max Dashboard Script
// FULL FILE – SAFE TO REPLACE
// ===================================================================

const serversContainer = document.getElementById("servers");
const userNameEl = document.getElementById("user-name");
const userAvatarEl = document.getElementById("user-avatar");

// ------------------------------------------------
// Fetch logged-in user info
// ------------------------------------------------
async function fetchUser() {
  const res = await fetch("/.netlify/functions/me", {
    credentials: "include"
  });

  if (!res.ok) {
    window.location.href = "/";
    return null;
  }

  return res.json();
}

// ------------------------------------------------
// Render servers
// ------------------------------------------------
function renderServers(guilds) {
  serversContainer.innerHTML = "";

  const manageable = guilds.filter(g =>
    g.owner || (Number(g.permissions) & 0x20)
  );

  if (manageable.length === 0) {
    serversContainer.innerHTML =
      "<p>No manageable servers found.</p>";
    return;
  }

  manageable.forEach(server => {
    const card = document.createElement("div");
    card.className = "server-card";

    card.addEventListener("click", () => {
      window.location.href = `/server.html?guild=${server.id}`;
    });

    const icon = server.icon
      ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
      : "/assets/default-server.png";

    card.innerHTML = `
      <img src="${icon}" alt="Server Icon">
      <h3>${server.name}</h3>
    `;

    serversContainer.appendChild(card);
  });
}

// ------------------------------------------------
// Init
// ------------------------------------------------
async function initDashboard() {
  const data = await fetchUser();
  if (!data) return;

  const user = data.user;
  const guilds = data.guilds;

  userNameEl.textContent = `${user.username}#${user.discriminator}`;
  userAvatarEl.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

  renderServers(guilds);
}

initDashboard();
