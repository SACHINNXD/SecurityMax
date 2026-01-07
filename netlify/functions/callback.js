export async function handler(event) {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: "Missing code"
    };
  }

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokenData, null, 2)
    };
  }

  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": `token=${tokenData.access_token}; Path=/; HttpOnly; SameSite=Lax`,
      Location: "/dashboard.html"
    }
  };
}
