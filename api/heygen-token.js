// Avatar: Judy Lawyer (6e32f90a) — Voice: Judy - Professional (4f3b1e99)
const AVATAR_ID = "6e32f90a-f566-45be-9ec7-a5f6999ee606";
const VOICE_ID  = "4f3b1e99-b580-4f05-9b67-a5f585be0232";

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
      avatar_id: AVATAR_ID,
      avatar_persona: { voice_id: VOICE_ID },
      is_sandbox: false,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    console.error("LiveAvatar token error:", r.status, text);
    return res.status(502).json({ error: `LiveAvatar API returned ${r.status}` });
  }

  const data = await r.json();
  const token = data?.data?.session_token;

  if (!token) {
    return res.status(502).json({ error: "No session token in response" });
  }

  res.status(200).json({ token });
}
