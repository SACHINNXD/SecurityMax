export async function handler() {
  const clientId = process.env.CLIENT_ID;

  // 🔒 HARD-CODED, SAFE
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
