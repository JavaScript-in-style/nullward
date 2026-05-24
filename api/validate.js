import { JWT_SECRET } from "./_config.js";

function base64urlFromBuffer(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padded2 = pad ? padded + "=".repeat(4 - pad) : padded;
  return Buffer.from(padded2, "base64").toString("utf8");
}

async function verifyJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");

  const [header, body, sig] = parts;
  const data = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expectedSig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  const expectedB64 = base64urlFromBuffer(expectedSig);

  if (expectedB64 !== sig) throw new Error("Invalid signature");

  const payload = JSON.parse(base64urlDecode(body));
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Expired");

  return payload;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = await verifyJWT(token);
    return res.status(200).json({ valid: true, tier: payload.tier, designation: payload.designation });
  } catch (e) {
    return res.status(401).json({ valid: false, error: e.message });
  }
}