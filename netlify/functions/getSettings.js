import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  const guildId = event.queryStringParameters?.guildId;

  if (!guildId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing guildId" }),
    };
  }

  const { data, error } = await supabase
    .from("server_settings")
    .select("enabled")
    .eq("guild_id", guildId)
    .single();

  if (error && error.code !== "PGRST116") {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      enabled: data?.enabled ?? false,
    }),
  };
}
