import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { guildId, enabled } = body;

    if (!guildId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing guildId" })
      };
    }

    const { error } = await supabase
      .from("server_settings")
      .upsert({
        guild_id: guildId,
        enabled: !!enabled,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("saveSettings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
}
