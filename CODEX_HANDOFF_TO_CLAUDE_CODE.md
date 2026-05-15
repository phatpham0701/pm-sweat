# Codex Handoff to Claude Code — Demo-Safe Stabilization

## Branch
codex/demo-safe-stabilization

## Goal
Make PM Sweat public copy honest, demo-safe, and handoff-ready without changing product architecture.

## Files Changed
- `src/screens/Landing.jsx`
- `src/screens/Onboarding.jsx`
- `src/screens/Partners.jsx`
- `public/sitemap.xml`
- `public/robots.txt`
- `vercel.json`
- `CODEX_HANDOFF_TO_CLAUDE_CODE.md`

## Claims Removed / Softened
| Original | Replacement | File |
|---|---|---|
| `2,841 athletes verified this week` | `Sample athlete activity preview` | `src/screens/Landing.jsx` |
| `Proof.run · v3 · cryptographic effort attestation` | `Demo verification flow · verified-source-ready` | `src/screens/Landing.jsx` |
| `17 brand partners live · sea region` | `Sample partner network · sea region` | `src/screens/Landing.jsx` |
| `Wcag aaa · soc 2 type ii · gdpr · ccpa` | `Accessible design principles · security roadmap · privacy-first consent model` | `src/screens/Landing.jsx` |
| `Cryptographic attestation runs locally — we read signals, never raw biometrics.` | `Demo verification summarizes selected workout signals. Real source integrations are planned.` | `src/screens/Landing.jsx` |
| `No one reads your data.` | `Partners see eligibility status, not raw workout details.` | `src/screens/Landing.jsx` |
| `Your heart rate never leaves your phone.` | `Raw health details are not shown to partners in this demo.` | `src/screens/Landing.jsx` |
| `Hardware signs the session locally` | `Verified-source-ready session summary` | `src/screens/Landing.jsx` |
| `Zero-knowledge match` | `Partner eligibility check` | `src/screens/Landing.jsx` |
| `ed25519 · valid` | `verified-source-ready` | `src/screens/Landing.jsx` |
| `Live · proof feed` | `Demo · activity feed` | `src/screens/Landing.jsx` |
| Public partner metrics (`94%`, `3.4×`, `−71%`, `4.8/5`) | Sample / demo / pilot-planning labels | `src/screens/Landing.jsx` |
| `Mint passport` | `Create Sweat Pass` | `src/screens/Onboarding.jsx` |
| `Run first attestation` | `Run demo verification` | `src/screens/Onboarding.jsx` |
| Technical source signatures (`ed25519`, `Secure Enclave`, `content hash`, `TLS + device id`) | Consumer-safe source/eligibility labels | `src/screens/Onboarding.jsx` |
| `We never store raw biometric data — only signed effort signals.` | `The flow is designed around privacy-safe eligibility, not raw workout disclosure.` | `src/screens/Onboarding.jsx` |
| `signed it with the device's hardware key... raw stream leaves your phone` | Demo verification and planned source integration language | `src/screens/Onboarding.jsx` |
| `17 live partners · sea region` | `Sample partner network · sea region` | `src/screens/Partners.jsx` |
| `No raw biometric ever leaves the device.` | `The demo is designed around privacy-safe eligibility, not raw workout disclosure.` | `src/screens/Partners.jsx` |
| `No raw user data is exposed — only counts.` | `This demo shows eligibility counts and campaign fit, not raw workout exports.` | `src/screens/Partners.jsx` |
| `Targeting happens server-side, against signed proofs` | `Targeting uses consent-based eligibility signals` | `src/screens/Partners.jsx` |
| `Case · origin supps` | `Sample pilot concept · origin supps` | `src/screens/Partners.jsx` |
| Origin Supps CAC / repeat purchase / match acceptance claims | Example campaign simulation and illustrative planning labels | `src/screens/Partners.jsx` |
| `Campaign · live` | `Campaign · sample` | `src/screens/Partners.jsx` |

## SEO / Sitemap Changes
- Rewrote `public/sitemap.xml` as a valid minimal XML sitemap.
- Kept only the true public marketing pages:
  - `https://pm-sweat.vercel.app/`
  - `https://pm-sweat.vercel.app/partners`
- Removed auth, protected app, onboarding, and badge detail routes from sitemap discovery.

## Robots Changes
- Kept `Allow: /` so the public landing and partners pages remain crawlable.
- Added disallow rules for protected/private/demo-only app routes.
- Confirmed sitemap reference: `Sitemap: https://pm-sweat.vercel.app/sitemap.xml`.

## Vercel Changes
- Added `vercel.json` SPA fallback rewrite to route all paths to `/index.html`.

## Build Result
- `npm run build`: fail
- Notes:
  - Initial build failed because `react-scripts` was not installed in this environment.
  - `npm ci --legacy-peer-deps --no-audit --no-fund` could not complete in this environment before termination; dependency installation stalled after npm proxy warnings.
  - No build errors from the edited source files were observed because the build toolchain could not be installed/executed.

## Remaining Mock Areas
- Garmin integration is still mock/demo.
- Auth is still localStorage/demo.
- Partner campaigns are still illustrative.
- Reward/payment/redemption logic is not production.
- Verification/proof layer is not production.
- Sweat Credit logic is still demo/business-rule v0.

## Architecture Safety Confirmation
- No backend added.
- No auth architecture changed.
- No routes renamed.
- No ProtectedRoute behavior changed.
- No lazy-loading/routing architecture redone.
- No major UI redesign.
- No dependency changes unless explicitly listed.
- No whole-repo formatting.

## Recommended Next Review for Claude Code
- Review copy replacements.
- Confirm product messaging still feels premium.
- Confirm production Vercel deploy.
- Confirm Lighthouse after deploy.
- Decide next monetization MVP scope.
