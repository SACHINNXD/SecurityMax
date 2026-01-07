export async function handler(event) {
  const guildId = event.queryStringParameters?.guild;

  if (!guildId) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: "Missing guild ID" })
    };
  }

  const res = await fetch(
    `https://discord.com/api/guilds/${guildId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.YOUR_DISCORD_BOT_TOKEN}`
      }
    }
  );

  if (res.status === 200) {
    const guild = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        botInServer: true,
        guild: {
          id: guild.id,
          name: guild.name,
          icon: guild.icon
        }
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ botInServer: false })
  };
}
