export async function handler() {
  return {
    statusCode: 302,
    headers: {
      "Set-Cookie":
        "user=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure",
      Location: "/"
    }
  };
}
