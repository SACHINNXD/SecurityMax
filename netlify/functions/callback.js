import fetch from "node-fetch";

export async function handler(event) {
    const code = event.queryStringParameters?.code;
    if (!code) {
        return {
            statusCode: 302,
            headers: { Location: "/" }
        };
    }

    try {
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
        if (!token.access_token) throw new Error("No token");

        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        });

        const user = await userRes.json();

        return {
            statusCode: 302,
            headers: {
                "Set-Cookie": `user=${encodeURIComponent(JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }))}; Path=/; HttpOnly; SameSite=Lax; Secure`,
                Location: "/dashboard.html"
            }
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 302,
            headers: { Location: "/" }
        };
    }
}
