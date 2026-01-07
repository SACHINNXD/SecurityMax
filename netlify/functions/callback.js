import fetch from "node-fetch";

export async function handler(event) {
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: "No code provided"
    };
  }

  try {
    const tokenRes = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI
        })
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("No access token");
    }

    return {
      statusCode: 302,
      headers: {
        "Set-Cookie": `token=${tokenData.access_token}; HttpOnly; Path=/; SameSite=Lax`,
        Location: "/dashboard.html"
      }
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "OAuth failed"
    };
  }
}
