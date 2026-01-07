export async function handler() {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return {
      statusCode: 500,
      body: "Missing CLIENT_ID or REDIRECT_URI"
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
