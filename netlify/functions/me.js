export async function handler(event) {
  try {
    const cookieHeader = event.headers.cookie || "";

    const token = cookieHeader
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return {
        statusCode: 200,
        body: JSON.stringify({ loggedIn: false })
      };
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!userRes.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ loggedIn: false })
      };
    }

    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await userRes.json();
    const guilds = await guildsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        loggedIn: true,
        user,
        guilds
      })
    };

  } catch (err) {
    console.error("ME FUNCTION ERROR:", err);

    return {
      statusCode: 200,
      body: JSON.stringify({ loggedIn: false })
    };
  }
}
