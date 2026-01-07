console.log("🔥 THIS IS THE NEW SERVER.JS");

const params = new URLSearchParams(window.location.search);
const guildId = params.get("guild");

console.log("Guild ID:", guildId);

fetch(`/.netlify/functions/checkBot?guild=${guildId}`)
  .then(res => {
    console.log("Status:", res.status);
    return res.text();
  })
  .then(text => {
    console.log("Response text:", text);
  })
  .catch(err => console.error(err));
