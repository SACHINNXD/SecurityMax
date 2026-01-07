// =======================================================
// Security Max Dashboard Script
// Compatible with provided dashboard.html
// =======================================================

const loginBtn = document.getElementById("loginBtn");
const userInfo = document.getElementById("userInfo");
const usernameEl = document.getElementById("username");
const welcomeName = document.getElementById("welcomeName");
const serversContainer = document.getElementById("servers");

async function loadDashboard() {
  let res;

  try {
    res = await fetch("/.netlify/functions/me", {
      credentials: "include"
    });
  } catch (err) {
    console.error("Failed to reach /me");
    return;
  }

  if (!res.ok) {
    console.log("Not logged in");
    return;
  }

  const data = await res.json();

  if (!data.loggedIn) {
    console.log("User not logged in");
    return;
  }

  const { user, guilds } = data;

  // -------------------------------
  // Update navbar auth section
  // -------------------------------
  loginBtn.style.display = "none";
  userInfo.style.display = "inline-block";

  const fullName = `${user.username}#${user.discriminator}`;
  usernameEl.textContent = fullName;
  welcomeName.textContent = user.username.toUpperCase();

  // -------------------------------
  // Render servers
  // -------------------------------
  renderServers(guilds);
}

function renderServers(guilds) {
  serversContainer.innerHTML = "";

  const manageableServers = guilds.filter(
    g => g.owner || (Number(g.permissions) & 0x20)
  );

  if (manageableServers.length === 0) {
    serversContainer.innerHTML =
      "<p class='no-servers'>No manageable servers found.</p>";
    return;
  }

  manageableServers.forEach(server => {
    const card = document.createElement("div");
    card.className = "server-card";

    const icon = server.icon
      ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
      : "/assets/default-server.png";

    card.innerHTML = `
      <img src="${icon}" alt="Server Icon">
      <span>${server.name}</span>
    `;

    card.addEventListener("click", () => {
      window.location.href = `/server.html?guild=${server.id}`;
    });

    serversContainer.appendChild(card);
  });
}

// Init on load
loadDashboard();
