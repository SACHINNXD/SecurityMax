export async function handler() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return {
      statusCode: 500,
      body: "Missing DISCORD_CLIENT_ID or DISCORD_REDIRECT_URI"
    };
  }

  const authUrl =
    "https://discord.com/oauth2/authorize" +
    "?client_id=" + clientId +
    "&response_type=code" +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=identify email guilds";

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    }
  };
}
