# Session Handoff — 2026-05-13

## What was done this session

- Brainstormed three video formats to showcase murmur (trailer / walkthrough / engineer explainer) — captured as `docs/video-specs.md`.
- Mapped the VC outreach surface beyond Richmond city-government targets — captured as `docs/vc-outreach.md`.
- Investigated Pebblebed (deep-tech VC, San Francisco) — concluded it is *not* a fit for murmur's current vertical positioning, but documented a possible "urban simulation substrate" reframe as a low-cost experiment.
- Confirmed Urban Innovation Fund (SF, Julie Lein + Clara Brenner) as the single best-fit fund on the list — pre-seed/seed, $500K–$3.5M, explicit govtech thesis.
- Explained pre-seed vs seed funding mechanics and the equity/dilution model to the user (foundational context, no doc artifact).

## Current state

**Docs added/modified this session:**
- `docs/video-specs.md` — NEW. Three video specs with production cost / audience / distribution.
- `docs/vc-outreach.md` — NEW. Three-tier VC list + grants + adjacent operators + sequencing plan.
- `docs/launch-video-script.md` — MODIFIED (small VO tweaks, pre-existing in working tree). Serves as the spec for video #2.

**Untracked, NOT committed in this handoff:**
- `app/logo-lab/page.tsx` — exploratory logo design page from prior session.
- `public/logo-variations/v01-prism.svg` through `v10-prism-comb.svg` — logo SVG variants.
- `.env` — secrets, never commit.

These were left untracked because they're unrelated to this session's scope. Decide separately whether to commit, gitignore, or delete.

**Production status of the videos themselves:**
- Trailer (1min): NOT started. Assets exist (`RichmondMap.mp4`, `WhatIsMurmur.mp4`, `Murmuration.mp4`) — needs re-cut + music + title cards.
- Walkthrough (2:30): scenes done, awaiting SF B-roll capture, on-camera intro, two live demo screen recordings.
- Engineer explainer (5–10min): NOT started. Format decision pending (recommended: whiteboard + code, Karpathy-style).

**Larger murmur ↔ Aretian context (carried from 2026-05-06 handoff):**
- Outreach templates were rebranded to Aretian; site still says Murmura Labs. Mixed branding unresolved.
- Three-shape decision (independent / JV / Aretian product) still open. Affects how VCs in `docs/vc-outreach.md` should even be approached — if murmur becomes an Aretian product, the VC plan is moot.

## Next steps (priority order)

1. **Resolve murmur ↔ Aretian shape first.** From the prior handoff, still unresolved. If murmur becomes an Aretian product, the VC outreach plan in `docs/vc-outreach.md` is irrelevant and should be archived. Don't send to VCs until this is decided.
2. **Decide VC positioning** (assuming staying independent) — vertical govtech (A) vs platform simulation (B). See `docs/vc-outreach.md` "The framing decision." Blocks all outreach copy.
3. **Cut the 1min trailer.** Cheapest unlock — assets exist, mostly re-cut + music. Days, not weeks. Required for every outreach lane (VC, accelerator, city pilot).
4. **Send Tier 1 VC batch in one week** — UIF first (local + best fit), then Urban.us, Govtech Fund, Bloomberg Beta, Equal Ventures. See `docs/vc-outreach.md` "Sequencing."
5. **Capture remaining walkthrough footage** — SF B-roll, on-camera intro, two live demo recordings (pre-bake Macdonald + Iron Triangle scenarios first).
6. **Apply for one non-dilutive grant in parallel** — NSF SBIR Phase I or Knight Foundation. Long lead time, start now.
7. **One Pebblebed experiment** — single paragraph with platform reframe, attach trailer. Treat response as positioning data, not a verdict.
8. **Two warm-intro requests to adjacent operators** — Replica or Tolemi alumni. One conversation reshapes the pitch faster than VC rejection feedback.
9. **Defer the engineer video** — do not produce until trailer + walkthrough are generating technical-due-diligence requests.

## Key decisions made

- **Three video tiers, not three videos with similar weight.** Trailer is cheap and high-leverage. Walkthrough is medium effort and the closer. Engineer video is 5–10× the cost and only justified if the first two pull technical interest.
- **All three videos share the same `LogoIntro.mp4` opener** for brand consistency regardless of entry point.
- **Pebblebed is a Tier 3 experiment, not a default target.** Wrong thesis fit unless murmur reframes as a platform.
- **City pilots and grants run in parallel with VC outreach,** not after. A Richmond pilot is non-dilutive runway and a credibility multiplier for any subsequent raise.
- **Vertical positioning (A) is the default.** The platform reframe (B) is a different company, not a different deck — only commit to it if the founder believes the platform play is the bigger business.

## Open questions

- **murmur ↔ Aretian shape still unresolved** (carried from 2026-05-06). Upstream to everything in this handoff.
- Which VC positioning — vertical govtech or platform substrate? Blocks Tier 1 outreach copy.
- Music license budget for the trailer? Affects custom score vs library (Musicbed / Artlist) vs original.
- Founder willing to go on-camera for the walkthrough? VO-only is an alternative.
- Is Richmond willing to be a *public* reference customer or only a quiet pilot? Affects walkthrough + case study aggressiveness.
- Engineer-video production budget — Option A (talking head, ~$0), B (whiteboard, ~$500 setup), C (full Remotion, ~2 weeks)? Pick before scheduling.
- Should `app/logo-lab/` and `public/logo-variations/` be committed, gitignored, or deleted?
