export async function handler(event) {
    const code = event.queryStringParameters?.code;

    if (!code) {
        return {
            statusCode: 302,
            headers: { Location: "/" }
        };
    }

    try {
        // 1️⃣ Exchange OAuth code for access token
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI
            })
        });

        const token = await tokenRes.json();
        if (!token.access_token) {
            throw new Error("Failed to get access token");
        }

        // 2️⃣ Fetch user info
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        });

        const user = await userRes.json();

        // 3️⃣ Fetch user guilds
        const guildRes = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        });

        const guilds = await guildRes.json();

        // 4️⃣ Filter: owner OR administrator
        const manageableGuilds = Array.isArray(guilds)
            ? guilds.filter(g =>
                g.owner === true ||
                ((Number(g.permissions) & 0x8) === 0x8)
              )
            : [];

        // 5️⃣ Store user + servers in secure cookie
        return {
            statusCode: 302,
            headers: {
                "Set-Cookie": `user=${encodeURIComponent(JSON.stringify({
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    email: user.email,
                    guilds: manageableGuilds
                }))}; Path=/; HttpOnly; SameSite=Lax; Secure`,
                Location: "/dashboard.html"
            }
        };

    } catch (err) {
        console.error("OAuth callback error:", err);
        return {
            statusCode: 302,
            headers: { Location: "/" }
        };
    }
}
