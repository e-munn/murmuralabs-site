# Session Handoff — 2026-04-24

## What was done this session

- **Stripped calendar dates from `docs/richmond-outreach-plan.md`.** Converted six-week timeline from date-anchored (`"Week 2: April 6 – 10"`, `"Tue 4/7"`) to sequence-only (`"Week 2"`, `"Tue"`). Plan is now reusable from any Day 1 start.
- **Scrubbed all `murmur.ai` references** across the repo (app metadata, legal doc, outreach plan, networking doc, templates). There is no `murmur.ai` domain. Replacements:
  - Product name in prose: `murmur` (bare)
  - Signature/brand URL: `murmuralabs.com`
  - Live tool URL: `https://murmur.murmuralabs.com/scenarios`
  - Trademark/domain row in `docs/legal.md` cleaned up after the global replace
  - `app/layout.tsx` title tag shortened
- **Built Richmond outreach email infrastructure via Resend:**
  - `scripts/outreach-templates.ts` — unified HTML+text template, `SENDER` config, `TARGETS` map for 5 policymakers (Curl, Velasco, Robinson, Jimenez, Zepeda), `renderEmail()` function
  - `scripts/send-outreach-email.ts` — CLI sender. Flags: `--target`, `--to`, `--from`, `--corburn`, `--dry-run`
  - Added `resend` and `tsx` devDeps
  - `RESEND_API_KEY` already present in `.env.local`
  - Discovered `murmuralabs.com` was already verified in Resend (us-east-1, verified ~22 days prior)
  - Default `--from` now `Elijah Munn <elijah@murmuralabs.com>`; reply-to `elijah@munn.studio`
  - Resend tags on every send: `campaign=richmond-outreach-v1`, `target=<key>`
- **Researched the $550M Chevron settlement** and concluded leading with it in outreach is strategically risky. It's a grassroots justice win (RPA, ACCE, Coalition of Black Excellence, Doria Robinson herself led the multi-year campaign), Chevron is contractually barred from taking credit for spending decisions, Richmond already hired a $300K community-engagement consultant, and Zepeda publicly said *"this is the people's money so the people should be the ones who tell us how to use it."* Vendor positioning around the $550M would read as opportunistic and damage long-term credibility in a small civic ecosystem.
- **Rewrote all 5 outreach templates:** dropped Chevron framing entirely, cut word count from ~290 to ~115 per email, removed em dashes, removed bulleted scenario lists, dropped the data-sources paragraph, reduced each target's personalization to one sentence anchored on their *existing stated work* (Robinson's Black Resiliency Project, Zepeda's Richmond-San Rafael Bridge, etc.).
- **Added CSS-only visual polish** to email HTML using the site's palette (body `#190f0a`, accent `#7a4a2d`, rule `#e8dfd6`, italic tagline `#9a8778`). Thin horizontal rule above signature is the single visual moment. No images, no SVGs — those don't render in Gmail/Outlook and trigger image-blocking elsewhere.
- **Test sends performed** (to `elijah@munn.studio`): multiple successful Resend sends; one send to `emunn@aretian.com` confirmed that arbitrary recipients work from the verified domain.
- **Discussion about verifying `aretian.com`** — walked through Squarespace DNS steps for both subdomain (`send.aretian.com`) and apex paths. Flagged strategic concerns twice about using an `@aretian.com` address for murmur outreach (fuses identities, creates IP trail, exposes venture to Aretian IT). Resolution pending.

## Current state

- **Site**: deploys on Vercel. Pitch deck at `/pitch`.
- **Email sending**: works. `npx tsx --env-file=.env.local scripts/send-outreach-email.ts --target <key> --to <email> [--dry-run]`
- **Verified Resend domain**: `murmuralabs.com` only. `aretian.com` not verified; not recommended either way.
- **Templates**: all 5 targets (curl, velasco, robinson, jimenez, zepeda) have clean, Chevron-free copy. All ~115 words, no em dashes, no bullet lists, consistent personalization pattern.
- **Target email addresses**:
  - `curl`: `shasa_curl@ci.richmond.ca.us` (best guess)
  - `velasco`: `lina_velasco@ci.richmond.ca.us` (best guess)
  - `robinson`, `jimenez`, `zepeda`: `toEmail` fields empty — need to be researched via Richmond city clerk's office (510-620-6513) or the city website
- **Zero real outreach has been sent** to Richmond officials yet. Only test sends to `elijah@munn.studio` and `emunn@aretian.com`.
- **Tracking**: Resend tags attached to every send; click tracking active on the signature tool URL; reply-tracking via `elijah@munn.studio`.
- **Uncommitted work**: all this session's changes are in the working tree awaiting this commit.

## Next steps (priority order)

1. **Inbox-check the test sends in `elijah@munn.studio`.** Verify inbox placement (inbox vs Promotions vs Spam), sender rendering (`Elijah Munn <elijah@murmuralabs.com>` cleanly, no `via resend.dev` banner), and click behavior on the tool URL. If anything lands in spam, warm the domain before sending to `ci.richmond.ca.us`.
2. **Warm the `murmuralabs.com` sending domain.** Send 10–20 low-stakes emails from `elijah@murmuralabs.com` over a few days (personal notes, newsletter-style sends to friends) before cold outreach to gov inboxes. Cold domains have zero reputation with Google Workspace / gov spam filters.
3. **Research and confirm real email addresses** for Velasco (currently best-guess), Robinson, Jimenez, Zepeda via Richmond city clerk's office (510-620-6513) or the city's official site. Update `toEmail` fields in `scripts/outreach-templates.ts`.
4. **External copy gut-check.** Send the rewritten Curl copy to 1–2 trusted readers (civic tech friend, another founder, someone in planning) and ask *"would you reply to this?"* before any real send.
5. **Decide on first-send sequencing.** The plan in `docs/richmond-outreach-plan.md` targets Curl + Velasco simultaneously in Week 2. Alternative: start with a lower-stakes target (Velasco) alone, gauge response, then approach Curl.
6. **Still outstanding from the prior (2026-04-05) handoff:**
   - Address Josh's feedback on interactive levers (parameter sliders, "draw your own scenario")
   - Address Josh's feedback on agent simulation transparency (show-your-work per cell, or update pitch language to match the actual cell-agency response model)
   - Legal consult on IP/non-compete per `docs/legal.md`
   - Attend networking events per `docs/networking-sf-urban-data.md`

## Key decisions made

- **Chevron framing dropped from all outreach.** Research showed it's a grassroots justice win with active community ownership of the allocation process. Any vendor mention of `$550M` reads as opportunistic. Template references were fully scrubbed and replaced with implementation-phase / existing-work anchors per target.
- **CSS-only styling in emails, no images/SVGs.** SVG doesn't render in Gmail or classic Outlook; hosted PNGs are blocked by default in every major client on first receipt. Plain HTML with subtle color accents preserves deliverability and personal feel. Logos/image chrome saved for warm follow-ups after a reply.
- **`murmuralabs.com` chosen over `aretian.com` for Resend verification.** Sending outreach from `@aretian.com` would fuse murmur and Aretian identities in recipients' inboxes, create an IP/non-compete paper trail (central risk per `docs/legal.md`), and require Aretian IT cooperation (surfacing the venture). Verified `murmuralabs.com` is the clean path.
- **CLI-driven send script, not an env-configured send.** Flags (`--target`, `--to`, `--corburn`, `--dry-run`) keep tests trivial and composable.
- **Resend tags on every send** (`campaign=richmond-outreach-v1`, `target=<key>`) so the dashboard can segment by recipient for engagement analytics.
- **Per-target personalization is one prose sentence**, not a bulleted scenario list. Anchors on the recipient's own stated work (public projects, stated priorities), not speculative scenario catalogs.

## Open questions

- **aretian.com verification path.** User asked about verifying it for Resend; I walked through Squarespace DNS steps but flagged strategic concerns twice. User didn't explicitly close the loop on whether they're proceeding. Default assumption: not proceeding for murmur outreach.
- **Send order and timing.** Plan says Curl + Velasco together in Week 2; no user decision yet on whether to start from Day 1 of a fresh sequence or send sooner.
- **Engagement monitoring script.** I offered to build `scripts/outreach-status.ts` to poll Resend events for a per-target funnel view (opens, clicks, replies). User didn't pick up.
- **A/B testing flag.** I offered to add `--tags-extra` for future subject-line variants. User didn't pick up.
- **Logo in signature for warm follow-ups.** I proposed adding a small hex logo PNG to the signature for the follow-up thread (after first reply, when image-blocking is no longer gating). Template for this not yet built.
- **Josh's open product feedback.** Still unresolved from the prior session: interactive levers and simulation transparency.
