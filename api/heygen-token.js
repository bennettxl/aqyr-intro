// Avatar: June HR (65f9e3c9) — Voice: June - Lifelike (62bbb4b2)
const AVATAR_ID = "65f9e3c9-d48b-4118-b73a-4ae2e3cbb8f0";
const VOICE_ID  = "62bbb4b2-bb26-4727-bc87-cfb2bd4e0cc8";

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
