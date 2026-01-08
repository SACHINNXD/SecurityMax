export async function handler(event) {
  try {
    const { guildId, enabled } = JSON.parse(event.body || "{}");

    if (!guildId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing guildId" })
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/server_settings?guild_id=eq.${guildId}`,
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          guild_id: guildId,
          enabled: enabled,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("saveSettings error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
}
