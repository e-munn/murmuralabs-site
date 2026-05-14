# Session Handoff — 2026-05-14

## What was done this session

No code changes. Tactical strategy session focused on **Richmond CA in-person outreach planning** — a sub-strand of the larger VC/pilot outreach work from the 2026-05-13 handoff.

- Validated the "show up at city hall" approach as a viable first move (vs. email-only). The user's rationale: get an unguarded read on cooperation/ownership/political posture *before* committing to which VC pitch (positioning A vs B) to lead with. No paper trail. Cold-walking lobbies wastes the trip; the working version is **attending a public meeting + introducing oneself to staff afterward**.
- Pulled the Richmond CA public-meeting calendar and identified relevant upcoming meetings (May 19, May 26 Council; June 4, June 18 Planning Commission; Library/Design Review noted but lower priority).
- Read the **May 5, 2026 Richmond City Council agenda** (the user pasted it). Extracted the items that matter:
  - **Q.1** — Councilmember **Claudia Jimenez**'s resolution opposing the Montezuma Carbon Sequestration Hub and CO2 pipelines through Richmond / Contra Costa / Solano. Continued from April 28. **Directly relevant to murmur's "where does infrastructure route, who bears the risk" wedge.** Highest single signal item on the agenda.
  - **P.1** — Marina Point Residential Project appeal of Planning Commission approval. Two appeals to council. Lina Velasco / Avery Stark = Community Development staff names.
  - **O.1** — FY 2026-27 Annual Operating Budget + FY 2026-31 Five-Year CIP under active deliberation *right now*. This is the window when departments shape what gets funded.
  - **N.4.b + Q.3** — ECIA (the Chevron settlement vehicle) is alive: new appointment to ECIA Transportation Board (Courtney Sanders); $390K appropriated from ECIA Transportation for bikeshare. Standing boards making real allocations.
- Identified key council members in order of relevance:
  1. **Claudia Jimenez (D6)** — climate/EJ, sponsors anti-extraction resolutions
  2. **Doria Robinson (D3, Vice Mayor)** — Urban Tilth founder, deep EJ credibility
  3. **Mayor Eduardo Martinez** — at-large
  4. Zepeda (D2), Brown (D1), Bana (D4), Wilson (D5)
- Mapped Richmond footage locations: Point Molate, Marina Bay, Richmond Greenway, Civic Center Plaza, Rosie the Riveter NPS site, refinery fenceline drive, Richmond BART/Macdonald Ave, Urban Tilth North Richmond Farm (ask first).
- Mapped offices walkable in one visit:
  - **City Clerk's Office** — 450 Civic Center Plaza, 3rd floor, Mon-Fri 8:30 AM – 5 PM, 510-620-6513. **Best first stop.**
  - **Community Development / Planning Division** — 440 Civic Center Plaza. Lina Velasco runs it.
  - **City Manager's Office** — Shasa Curl. Not a cold-walk target.
  - **Public Works** — Gabino Arredondo.
- Persisted durable Richmond intel to memory:
  - `reference_richmond_ca_govt.md` — people, addresses, meeting cadence, ECIA
  - `project_richmond_outreach_strategy.md` — in-person-first approach + framing rules

## Current state

**This session: no code or doc files changed.** All artifacts are in memory + this handoff.

**Carryover from 2026-05-13 handoff (still unresolved and load-bearing):**
- `docs/video-specs.md`, `docs/vc-outreach.md`, `docs/launch-video-script.md` exist on `main`.
- **murmur ↔ Aretian shape unresolved** — upstream to everything. If murmur becomes an Aretian product, the VC plan is moot.
- **VC positioning A vs B unresolved** — vertical govtech vs platform simulation substrate. Blocks Tier 1 outreach copy. This is part of why the Richmond trip matters — the user wants real signal before committing.
- Trailer (1min) NOT cut. Walkthrough scenes done, awaiting SF B-roll. Engineer explainer not started.
- Untracked files from prior sessions: `app/logo-lab/`, `public/logo-variations/`, `.env` (.env stays untracked forever).
- Mixed branding (outreach is Aretian, site is Murmura Labs) unresolved.

**This session adds to that:**
- A planned Richmond trip combining (a) a public meeting attendance, (b) a same-day City Clerk + Community Development walk-in, (c) day-of footage capture at Point Molate / Marina Bay / Civic Center.
- Memorial Day **Mon May 25** — Richmond city offices closed. May 26 will be catch-up + busy.

## Next steps (priority order)

These split into "Richmond trip prep" (this session's work) and "carryover from yesterday" (still the bigger blockers).

**Richmond trip prep (new, this session):**
1. **Pull the May 5 council meeting video off Granicus** (`https://richmond.granicus.com/ViewPublisher.php?view_id=10`) and watch Q.1 — Jimenez's CO2 pipeline opposition. This is the highest-signal segment for framing/language to mirror.
2. **Pick a trip date.** Tue May 19 (Council, 6 PM) or Thu Jun 4 (Planning Commission, 6:30 PM, better technical-wedge venue). May 19 catches budget hearings still mid-cycle; Jun 4 catches the room that argues land-use decisions.
3. **Draft a one-pager to leave at the City Clerk's office** — researcher framing, no vendor framing, no Chevron mention, no Aretian/MIT mention. Generic ("a simulation tool I'm building") may be safer than naming murmur on first contact — open question.
4. **Plan the day**: arrive Richmond early afternoon → walk Marina Bay → shoot Point Molate near sunset → City Clerk visit 1:30–3:30 PM → council meeting at 6 PM. Bring a phone gimbal + DSLR, no tripod (avoids needing a film permit).
5. **If Urban Tilth visit desired**, email ahead — don't ambush. Vice Mayor Robinson's organization.
6. **Post-trip**: warm-email follow-up using `scripts/send-outreach-email.ts` (Resend setup), referencing the in-person conversation. The trip earns warm email; it does not replace it.

**Carryover from 2026-05-13 (still upstream of everything):**
7. **Resolve murmur ↔ Aretian shape.** Until this is decided, all VC outreach in `docs/vc-outreach.md` is provisional.
8. **Decide VC positioning A vs B.** The Richmond trip is partly an input to this decision — wait for that signal before sending Tier 1 batch.
9. **Cut the 1min trailer.** Cheapest unlock. The Richmond trip will produce new b-roll that strengthens it.
10. **Send Tier 1 VC batch** — UIF first, then Urban.us, Govtech Fund, Bloomberg Beta, Equal Ventures. Gated on (7) and (8).
11. **Apply for one non-dilutive grant in parallel** — NSF SBIR Phase I or Knight Foundation.
12. **Defer engineer video** until trailer + walkthrough generate technical-due-diligence requests.

## Key decisions made

**This session:**
- **In-person before email for Richmond.** Walk-in at City Clerk + attending a public meeting is the first move, not cold email. Reason: user wants unguarded read on cooperation/IP/political posture that email can't deliver.
- **Framing at the door: "researcher, not vendor."** "I'm an engineer working on a tool that lets cities and community groups simulate how land-use and infrastructure decisions play out across neighborhoods. I'm not selling anything yet."
- **No laptop demo on first visit.** Be remembered as a person, not a product.
- **Don't cold-walk Mayor's or Councilmember offices.** Appointments only.
- **Best room for murmur's technical wedge is Planning Commission**, not City Council. Council is for political signal.
- **Q.1 (CO2 pipeline opposition) is the language to mirror.** Jimenez's framing is the bottom-up, anti-extraction posture murmur should align with rhetorically.

**Carried from 2026-05-13:**
- Three video tiers (trailer cheap + high-leverage; walkthrough = closer; engineer video deferred).
- All videos share the `LogoIntro.mp4` opener.
- Pebblebed = Tier 3 experiment.
- City pilots + grants run *parallel* with VC outreach, not after.
- Vertical positioning (A) is the default unless platform conviction emerges.

## Open questions

**This session:**
- Trip date — May 19 (Council) vs Jun 4 (Planning Commission) vs different week?
- One-pager: name "murmur" or stay generic on first walk-in?
- Email Urban Tilth ahead, or visit publicly and ask on arrival?

**Carried from 2026-05-13 (still open):**
- **murmur ↔ Aretian shape** — upstream blocker.
- VC positioning A vs B.
- Music license budget for trailer (custom vs library vs original).
- Founder on-camera for walkthrough vs VO-only.
- Richmond as public reference customer vs quiet pilot — affects walkthrough/case study.
- Engineer video production budget (A talking head $0, B whiteboard ~$500, C full Remotion ~2 weeks).
- Disposition of `app/logo-lab/` and `public/logo-variations/` (commit, gitignore, or delete).
