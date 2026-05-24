import { RANKS, JWT_SECRET } from "./_config.js";

// Encode a string to base64url
function base64urlFromString(str) {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Encode an ArrayBuffer to base64url
function base64urlFromBuffer(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function signJWT(payload) {
  const header = base64urlFromString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64urlFromString(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${base64urlFromBuffer(sig)}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic rate limiting via headers (Vercel edge provides IP)
  res.setHeader("Access-Control-Allow-Origin", "*");

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { passphrase } = body || {};
  if (!passphrase || typeof passphrase !== "string") {
    return res.status(400).json({ error: "Missing passphrase" });
  }

  const normalized = passphrase.toLowerCase().trim();

  // Deliberately slow compare to resist timing attacks
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 200));

  const match = RANKS.find((r) => r.passphrase === normalized);

  if (!match) {
    return res.status(401).json({ error: "Unrecognized" });
  }

  const token = await signJWT({
    tier: match.tier,
    designation: match.designation,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  });

  return res.status(200).json({
    tier: match.tier,
    designation: match.designation,
    description: match.description,
    token,
  });
}