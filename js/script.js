async function loadDashboard() {
    const res = await fetch("/.netlify/functions/me", {
        credentials: "include"
    });

    const user = await res.json();
    if (!user) return;

    // Auth UI
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("userInfo").style.display = "block";
    document.getElementById("username").textContent = user.username;
    document.getElementById("welcomeName").textContent = user.username;

    // Servers
    const container = document.getElementById("servers");
    container.innerHTML = "";

    if (!user.guilds || user.guilds.length === 0) {
        container.innerHTML = "<p style='color:#9ca3af'>No manageable servers found.</p>";
        return;
    }

    user.guilds.forEach(guild => {
        const card = document.createElement("div");
        card.className = "server-card";

        const icon = guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : "https://cdn.discordapp.com/embed/avatars/0.png";

        card.innerHTML = `
            <img src="${icon}" alt="Server Icon">
            <h3>${guild.name}</h3>
            <span>${guild.owner ? "Owner" : "Admin"}</span>
        `;

        container.appendChild(card);
    });
}

loadDashboard();
