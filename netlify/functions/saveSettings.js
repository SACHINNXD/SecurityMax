import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { guildId, enable } = JSON.parse(event.body || "{}");

  if (!guildId) {
    return { statusCode: 400, body: "Missing guildId" };
  }

  const { error } = await supabase
    .from("server_settings")
    .upsert({
      guild_id: guildId,
      enabled: enable,
      updated_at: new Date()
    });

  if (error) {
    console.error("Supabase error:", error);
    return {
      statusCode: 500,
      body: "Database error"
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
