# PROJECT NULLWARD

A tiered, cipher-gated access portal with SCP-style institutional lore.

---

## Structure

```
nullward/
├── api/
│   ├── _config.js      ← rank definitions + passphrases (server-side only)
│   ├── verify.js       ← POST /api/verify — checks passphrase, returns JWT
│   └── validate.js     ← GET /api/validate — validates JWT, returns tier
├── public/
│   ├── index.html      ← landing page / entry portal
│   ├── cipher/
│   │   └── index.html  ← puzzle hints (no answers given directly)
│   └── vault/
│       └── index.html  ← tier-gated content
├── vercel.json
└── package.json
```

---

## Deploying to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Push to GitHub
Create a repo, push this folder. Then in Vercel dashboard: New Project → Import → select the repo.

### 3. Set environment variable
In Vercel dashboard → Project Settings → Environment Variables:
```
NULLWARD_JWT_SECRET = (generate a long random string, e.g. openssl rand -hex 32)
```

### 4. Deploy
```bash
vercel --prod
```

---

## Customising the lore

All rank definitions and passphrases are in `api/_config.js`.
The passphrases listed are:
- Tier 1 WITNESS:   `meridian`
- Tier 2 RUNNER:    `oblique`
- Tier 3 OPERATOR:  `threshold`
- Tier 4 WARDEN:    `ironveil`
- Tier 5 ARCHIVIST: `sotherby`
- Tier 6 ARCHITECT: `nullward`

Change these freely. The cipher page hints at each one without giving them directly.

---

## Security notes

- Passphrases never reach the frontend — all verification is server-side
- JWTs are signed with HMAC-SHA256 using your secret
- The vault page validates the JWT against /api/validate on load
- Tier 7 (NULL) is intentionally unreachable — no passphrase exists for it

---

## Adding content to the vault

Edit `public/vault/index.html` — each `content-section` div corresponds to a tier range.
Add your own `doc-block` elements with whatever lore, files, or links you want.
Use the `.redacted` span class for the ████ redaction effect.
