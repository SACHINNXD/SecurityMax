import fetch from "node-fetch";

export async function handler(event) {
  const cookie = event.headers.cookie || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  try {
    const userRes = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const guildsRes = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const user = await userRes.json();
    const guilds = await guildsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ user, guilds })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal error" })
    };
  }
}
