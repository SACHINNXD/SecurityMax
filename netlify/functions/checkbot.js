export async function handler(event) {
  const cookie = event.headers.cookie || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return {
      statusCode: 200,
      body: JSON.stringify({ loggedIn: false })
    };
  }

  const guildId = event.queryStringParameters.guild;

  // Get user guilds
  const userGuildsRes = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const userGuilds = await userGuildsRes.json();

  // Get bot guilds
  const botGuildsRes = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bot ${process.env.YOUR_DISCORD_BOT_TOKEN}`
      }
    }
  );

  const botGuilds = await botGuildsRes.json();

  const botInServer = botGuilds.some(g => g.id === guildId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      loggedIn: true,
      botInServer,
      clientId: process.env.CLIENT_ID
    })
  };
}
