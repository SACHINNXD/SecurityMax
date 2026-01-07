export async function handler() {
  const clientId = process.env.CLIENT_ID;

  if (!clientId) {
    return {
      statusCode: 500,
      body: "CLIENT_ID is missing in environment variables"
    };
  }

  const redirectUri =
    "https://securitymax-bot.netlify.app/.netlify/functions/callback";

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
