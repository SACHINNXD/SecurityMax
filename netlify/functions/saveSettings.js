export async function handler(event) {
  const { guildId, enable } = JSON.parse(event.body);

  // TEMP: log only (no DB yet)
  console.log("SAVE SETTINGS:", guildId, enable);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
