export async function handler() {
  return {
    statusCode: 302,
    headers: {
      "Set-Cookie":
        "user=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure",
      Location: "/"
    }
  };
}
