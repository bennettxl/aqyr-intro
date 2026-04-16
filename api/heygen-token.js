export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: { "x-api-key": process.env.HEYGEN_API_KEY },
  });

  const data = await r.json();
  const token = data?.data?.token;

  if (!token) {
    return res.status(502).json({ error: "Failed to mint HeyGen token" });
  }

  res.status(200).json({ token });
}
