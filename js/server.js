async function loadDashboard() {
  let res;

  try {
    res = await fetch("/.netlify/functions/me");
  } catch (err) {
    console.warn("Auth check failed:", err);
    return;
  }

  if (!res || res.status !== 200) {
    // User not logged in
    return;
  }

  const data = await res.json();

  // ===== SAFE ELEMENT LOOKUPS =====
  const loginBtn = document.getElementById("loginBtn");
  const userInfo = document.getElementById("userInfo");
  const usernameEl = document.getElementById("username");
  const welcomeName = document.getElementById("welcomeName");
  const serversContainer = document.getElementById("servers");

  // ===== UI UPDATE (SAFE) =====
  if (loginBtn) loginBtn.style.display = "none";
  if (userInfo) userInfo.style.display = "flex";
  if (usernameEl) usernameEl.textContent = data.username;
  if (welcomeName) welcomeName.textContent = data.username;

  // ===== SERVERS LIST (ONLY IF PRESENT) =====
  if (!serversContainer || !Array.isArray(data.guilds)) return;

  serversContainer.innerHTML = "";

  data.guilds.forEach(guild => {
    const card = document.createElement("div");
    card.className = "server-card";

    const icon = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : "/assets/logo.png";

    card.innerHTML = `
      <img src="${icon}" alt="Server Icon">
      <span>${guild.name}</span>
    `;

    card.addEventListener("click", () => {
      window.location.href = `/server.html?guild=${guild.id}`;
    });

    serversContainer.appendChild(card);
  });
}

// Run safely on every page
loadDashboard();
