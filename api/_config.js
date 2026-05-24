// NULLWARD rank definitions — server-side only, never exposed to client
// Each rank has: a passphrase the user must type, and the tier it unlocks

export const RANKS = [
  {
    tier: 1,
    designation: "WITNESS",
    passphrase: "meridian",       // simple — first puzzle is easy
    description: "Entry clearance. Read-only access to public NULLWARD communications.",
  },
  {
    tier: 2,
    designation: "RUNNER",
    passphrase: "oblique",        // slightly less obvious
    description: "Internal correspondence and non-sensitive directives.",
  },
  {
    tier: 3,
    designation: "OPERATOR",
    passphrase: "threshold",      // the cipher page hints at this abstractly
    description: "Field operations. Partial context only.",
  },
  {
    tier: 4,
    designation: "WARDEN",
    passphrase: "ironveil",       // compound — harder
    description: "Combat and protective clearance. Authorized use of force.",
  },
  {
    tier: 5,
    designation: "ARCHIVIST",
    passphrase: "sotherby",       // opaque proper noun — requires deep cipher solve
    description: "Full archive access. Knows the history.",
  },
  {
    tier: 6,
    designation: "ARCHITECT",
    passphrase: "nullward",       // the name itself, hidden in plain sight all along
    description: "Structural authority. Shapes all directives.",
  },
];

// Tier 7 (NULL) has no passphrase — it is unreachable by design

export const JWT_SECRET = process.env.NULLWARD_JWT_SECRET || "change-this-in-production";
