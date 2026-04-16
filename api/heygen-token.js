export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const r = await fetch("https://api.liveavatar.com/v1/sessions/token", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.HEYGEN_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "FULL",
      avatar_id: process.env.AVATAR_ID || "3e904978-9d0c-41b1-9c91-7f20152954fd",
      is_sandbox: false,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    console.error("LiveAvatar token error:", r.status, text);
    return res.status(502).json({ error: `LiveAvatar API returned ${r.status}` });
  }

  const data = await r.json();
  const session_token = data?.data?.session_token;
  const session_id = data?.data?.session_id;

  if (!session_token) {
    return res.status(502).json({ error: "No session token in response" });
  }

  res.status(200).json({ token: session_token, session_id });
}
