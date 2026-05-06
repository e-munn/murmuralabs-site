# Session Handoff — 2026-05-06

## What was done this session

- **Replaced "Murmura Labs presents" with the Aretian wordmark in `LogoIntro.tsx`.** Stage 1 of the 5-second intro now shows the Aretian wordmark + "presents" caption; Stage 2 (big "murmur", "urban foresight platform", v0.1 + April 2026 pill) is unchanged.
- **Added `remotion/public/aretian-logo.svg`** — the wordmark variant from `~/aretian/cdt/cdt-expansion/public/logo/aretian-logo-light.svg` with fills swapped from `rgb(100%, 100%, 100%)` to `#190f0a` (espresso) so it reads on the linen background. ViewBox preserved at `95 107 687 210`.
- **Re-rendered `remotion/out/logo-intro.mp4`** (1.1 MB, 150 frames @ 30fps). Identical duration to prior cut, so dropping it onto the existing FCP timeline via Replace from Start preserves all downstream cuts.
- **Walked through FCP replacement flow** for the case where the Finder file already exists: drag-with-Option, Relink Files dialog accepting drag-drop, "Replace from Start" as the safe default for same-duration re-renders.
- **Wrote a full inventory of the project's data sources** (live APIs, bundled JSON, remotion data, outreach pipeline). See "Data sources" section below for the canonical list.
- **Drafted a side-by-side comparison of murmur vs CDT** (Aretian's Catalan Digital Twin shipping early–mid May 2026). Captured the meaningful divergences: prescriptive vs exploratory, regional EU vs municipal US, spatial-intelligence vs agent-based-modeling lineages. The complementarity framing — "CDT recommends placement, murmur simulates consequence" — is the headline.
- **Captured the Ramon + Fanny meeting context** (2026-04-30): Aretian leadership wants to absorb murmur as an Aretian product. Saved as `project_aretian_differentiation.md` in auto-memory; the strategic implication and three-shape decision frame (independent / JV / inside) are documented in conversation history but not yet in code or docs.
- **Outlined deal-structure shapes for Option 3** (Aretian-owned, Elijah leads): revenue/profit share, phantom equity in murmur as a business unit, equity in a murmur subsidiary, bonus pool, parent-company equity. Critical fork is enterprise-value claim (founder economics) vs operating profit share (operator economics).

## Current state

- **Working tree being committed in this handoff:**
  - `remotion/src/compositions/LogoIntro.tsx` — Aretian-branded intro
  - `remotion/public/aretian-logo.svg` — new asset
  - `scripts/outreach-templates.ts` — **strategic rebrand pre-existing in working tree** (see "Key decisions" below)
  - `.gitignore` — added `/out/` so future generated artifacts (email previews, ad-hoc cards) don't pollute commits
- **Generated but NOT committed (now gitignored):**
  - `out/aretian-card-1920x1080.{pdf,png,svg}` — business-card-style exports of unknown provenance (no script in repo creates them)
  - `out/email-preview.html` — rendered preview from `outreach-templates.ts` showing the new Aretian-branded email
  - `remotion/out/logo-intro.mp4` and other `.mp4` renders — already gitignored under `remotion/out/`
- **Site (Next.js)**: unchanged this session. Still deploys on Vercel; still uses the `Murmura Labs / murmur` brand throughout the public copy. The site/email branding is now **inconsistent** — site says Murmura Labs, outreach emails say Aretian. Resolve before sending real outreach.
- **Resend**: still configured for `elijah@murmuralabs.com` with reply-to `elijah@munn.studio`. The new Aretian-branded template will send from a `murmuralabs.com` address — that mismatch will read as a phishing signal to recipients and to Gmail's spam classifier. Resolve before sending.
- **Richmond outreach: zero real sends still.** All test sends so far have gone to `elijah@munn.studio` and `emunn@aretian.com`.

## Next steps (priority order)

1. **Decide the shape of the murmur ↔ Aretian relationship** (independent / JV / Aretian product) before any further branding moves. The outreach-templates rebrand to Aretian implies movement toward Option 2 or 3 but no formal structure exists yet. Don't send the Aretian-branded email to Richmond officials until this is decided — once an `aretian.com`-signed email lands in a city manager's inbox referencing "murmur," the branding is publicly co-mingled.
2. **Reconcile site brand vs outreach brand.** Either: (a) revert `outreach-templates.ts` to Murmura Labs framing if staying independent, (b) rebrand the site to Aretian if absorbing, or (c) explicitly position murmur as "an Aretian product" everywhere with consistent copy. Mixed branding is the worst of all worlds and will hurt deliverability and credibility.
3. **Independent legal read on the employment agreement and IP/non-compete.** Required to negotiate Option 2 or 3 fairly and to confirm Option 1 is even available. Not optional before any deal conversation with Ramon/Fanny.
4. **If staying independent (Option 1):** revert the outreach template rebrand, ship the differentiation pitch as the formal posture (simulation vs recommendation, US vs EU, agents vs spatial intelligence), don't accept Aretian distribution help, intros, or co-branded assets.
5. **If pursuing Option 2 or 3:** get the proposed structure on paper from Aretian *before* counter-proposing. Anchor opening ask: 15–25% phantom equity in murmur as a business unit (or comparable rev-share floor), with tag-along rights, IP reversion clause, and good-leaver protections. Insist on revenue/gross-margin share — not "profit" — to avoid cost-allocation games.
6. **Verify Resend domain alignment** with whatever sender identity wins (1). If outreach goes from `@aretian.com`, that domain needs verification and warming; if from `@murmuralabs.com`, the existing setup stands.
7. **Inbox-check test sends** of the Aretian-branded email — particularly the inline SVG signature logo, which historically gets stripped or downloaded-as-attachment by some clients.
8. **Still outstanding from prior handoffs:**
   - Research and confirm real email addresses for Velasco, Robinson, Jimenez, Zepeda
   - Warm the sending domain before any cold gov outreach
   - Address Josh's feedback on interactive levers and agent-simulation transparency
   - Address legal items in `docs/legal.md`

## Key decisions made

- **`scripts/outreach-templates.ts` was rebranded to Aretian outside of this Claude session.** Working tree at session start already had: sender = "Eli Munn" / Aretian / "Urban analytics and design" / `aretian.com`, with an inline Aretian wordmark SVG (fill `#010029`, brand blue per `reference_aretian_brand.md`) embedded in the signature. Body copy stripped from ~115 words to ~50 words around a YouTube demo link (`https://youtu.be/67aNyscPWbM`). Personalized paragraph removed entirely. **This decision predates this session and is being committed as-is**, but it's a meaningful posture shift and should be evaluated against the murmur↔Aretian decision in step 1 above.
- **LogoIntro composition pivots Aretian-forward.** "Murmura Labs presents" → "[Aretian wordmark] / presents". Stage 2 still says "murmur" + "urban foresight platform" — preserves the product-name reveal but reframes the parent. Consistent with outreach rebrand direction.
- **`/out/` added to .gitignore.** Treating top-level `out/` the same way as `remotion/out/` — generated artifacts don't belong in git. Anyone regenerating cards/previews will produce them locally.
- **Aretian logo asset sourcing.** Pulled from sibling repo `~/aretian/cdt/cdt-expansion/public/logo/`, fill swapped to espresso for linen-background use. If Aretian updates the master wordmark, port the new path data over.

## Open questions

- **What does Elijah want murmur to be?** This is the upstream question to everything else. Independent founder upside (Option 1), JV/spinout with Aretian as minority stakeholder (Option 2), or Aretian-owned with Elijah leading inside (Option 3). The outreach-template rebrand suggests directional movement toward 2 or 3 but is reversible until real sends happen.
- **Did Ramon/Fanny propose a specific structure?** Their "make it an Aretian product" was an implication, not an offer. Need to elicit a written proposal before counter-proposing.
- **Who controls Richmond customer relationships if Aretian absorbs?** Particularly delicate because the Richmond outreach was researched and built independently; if those become Aretian accounts, they're not founder-defensible later.
- **Is there a path where CDT and murmur are the same Aretian product family** (CDT = recommendation engine, murmur = simulation engine, sold together)? Ramon and Fanny may already have this in mind. Worth probing in the next conversation.
- **What is Aretian's position on murmur using `aretian.com` for outreach?** The inline-logo email is being prepared but no permission has been confirmed.

## Data sources reference

For the next session — full inventory was compiled this turn:

**Live API fetches (site):**
- Overture Maps (`overture-maps-api.thatapicompany.com`) → buildings (`src/city/Buildings.tsx`, demo key)
- OSM Overpass (`overpass-api.de/api/interpreter`) → roads/infra (`src/city/osm-utils.ts`, `Infrastructure.tsx`)
- Barcelona Open Data datastore SQL → street trees, *Arbrat Viari* (`src/city/Trees.tsx`)
- Barcelona Open Data, *carrils-bici-construccio* → bike lanes (TODO, captcha-blocked)

**Bundled JSON (`public/data/`):**
- `barcelona/{bicing-stations,bus-stops,parking-zones,traffic-violations,transit-stops}.json`
- `perimeter/barcelona-{buildings,roads,trees}{,-1200m,-custom}.json`, `custom-perimeter{,-shrunk}.json`

**Remotion:**
- `remotion/src/data/richmond-cells.json` (1.2 MB, H3 cells via `scripts/generate-richmond-overlay.ts`)
- `remotion/public/richmond-base.png` (basemap via `scripts/fetch-richmond-base.ts`, Mapbox)
