import fetch from "node-fetch";

export async function handler(event) {
  const guildId = event.queryStringParameters.guild;

  const token = event.headers.cookie
    ?.split("token=")[1]
    ?.split(";")[0];

  if (!token || !guildId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  try {
    // Fetch user guilds
    const userGuildsRes = await fetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const guilds = await userGuildsRes.json();
    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "No access to server" })
      };
    }

    // Check if bot is in server
    const botRes = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      }
    );

    const inServer = botRes.status === 200;

    return {
      statusCode: 200,
      body: JSON.stringify({
        inServer,
        serverName: guild.name,
        invite: `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot%20applications.commands&permissions=8&guild_id=${guildId}`
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal error" })
    };
  }
}
