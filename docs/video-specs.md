# murmur — video specs

Three videos, three audiences. Build the trailer and the walkthrough first; the engineer explainer is 5–10× the production cost and only worth it once the first two are generating conversations.

---

## 1. Trailer — 60s, cold-audience hook

**Purpose**
Stop the scroll. Make the viewer feel "what *is* this?" — not "I understand what this does." Top of outreach emails, social, VC cold drops.

**Audience**
Cold traffic. Assume zero context. VCs skim this in 10 seconds.

**Format**
Pure visuals + music. No voiceover. No talking head. Light typography only — title card, tagline card, end card.

**Structure (60s)**

| Time | Beat | Visual |
|------|------|--------|
| 0:00–0:08 | Tension / question | SF / Richmond aerial. Slow push-in. Title card fades: *what if cities could think?* |
| 0:08–0:25 | Reveal — the money shot | `RichmondMap.mp4` re-cut: slower spiral → post-fill flock undulation. This is the hero. |
| 0:25–0:40 | Hint at the system | `WhatIsMurmur.mp4` three-layer hex reveal. No labels — just the geometry doing the work. |
| 0:40–0:52 | Hint at the product | 2–3 second flash cuts from the Macdonald / Iron Triangle scenarios. Numbers visible but unreadable. Implies depth without explaining. |
| 0:52–0:60 | Tagline card | **murmur** · *city intelligence* · murmuralabs.com |

**Music**
One piece, slow build, no drop. Something between Jóhann Jóhannsson and Floating Points. The flock undulation should land on a swell.

**Production cost**
Low — most assets already exist (`RichmondMap.mp4`, `WhatIsMurmur.mp4`, `Murmuration.mp4`). Main work is re-cut + music licensing + title cards.

**Distribution**
Embed in cold emails (above the fold). Twitter / LinkedIn posts. Top of murmuralabs.com hero. Loops well on social — no VO means it works with sound off.

---

## 2. Feature walkthrough — 2:30, warm-lead conversion

**Status: already drafted** — see `docs/launch-video-script.md`.

**Purpose**
For viewers who clicked through from the trailer or an email. Answers "should I take a meeting?" Concrete capabilities, light narration, screen recording + scene cuts.

**Audience**
Mid-funnel — people who already know roughly what murmur is and want to see it do the thing. Planners, EJ org staff, seed-stage VCs evaluating.

**Format**
Founder VO over scene cuts + live screen recordings of the Macdonald and Iron Triangle scenarios. YouTuber pacing (~2.7 wps).

**Beats**
See `launch-video-script.md` for the full shot list, VO, and timing breakdown. Eight scenes: intro, LogoIntro, RichmondMap, WhatIsMurmur, two demo scenarios, ForkScenario, Murmuration outro.

**Production status**
- VO script: done.
- Pre-rendered scenes: done (5 Remotion compositions).
- SF B-roll: to capture.
- On-camera intro: to capture.
- Live demo screen recordings: to capture (scenarios need to be pre-baked).

**Distribution**
Embedded mid-page on the site. Sent as the second touch after a cold trailer. The thing that actually closes meetings.

---

## 3. Engineer explainer — 5–10min, technical depth

**Purpose**
Convince technical evaluators that this isn't vaporware. Used in (a) VC due diligence after a good first call, (b) hiring, (c) credibility-building with technical advisors at partner orgs.

**Audience**
Engineers, technical VCs (Pebblebed-style), CTO-track hires, academic collaborators.

**Format options — pick one before producing**

**Option A: Talking head + screen share** (Karpathy-lecture style, low budget)
- Founder on camera, IDE + dashboard share for visuals.
- ~$0 production cost. ~1 weekend to record + edit.
- Risk: feels like a YouTube tutorial, not a product video. Works if the founder is charismatic on camera.

**Option B: Whiteboard + code** (Karpathy / 3Blue1Brown adjacent)
- Draw the architecture diagram live. Then cut to code walkthroughs.
- Moderate cost. Requires good whiteboard handwriting + a planned diagram.
- Best fit for the "second-order effects" pitch — the math/diagram explains itself.

**Option C: Remotion-animated + VO** (highest production, highest reuse)
- Animated diagrams of the data pipeline, model graph, agent interactions.
- Expensive (~2 weeks of Remotion work). But assets are reusable for trailer cutdowns and the site.
- Best if you plan to make 2+ technical videos. One-and-done = not worth it.

**Recommended: Option B** — whiteboard + code. Cheapest credibility-per-minute, and the agent-based modeling content lends itself to drawn diagrams better than animation. Karpathy proves the format converts.

**Content outline (8–10min target)**

1. **The problem, stated technically** (1min)
   Why second-order effects in cities are *actually* hard. Why most planning tools punt on them. The dimensionality + data-integration gap.

2. **The data layer** (2min)
   ACS, CalEnviroScreen, CDC PLACES, parcel/zoning data. How you reconcile across scales (parcel → block → tract). The cells-as-primitive design choice.

3. **The model layer** (2–3min)
   Geospatial + network science + economic complexity. Why this combo, not just one. Where agent-based modeling enters. How interactions become priorities.

4. **The scenario compiler** (1–2min)
   Natural-language scenarios → executable simulation. What "Upzone the Iron Triangle" actually compiles to under the hood. Honest about what's still hand-coded.

5. **What's next, technically** (1min)
   What breaks at scale. What's coming in v0.2. What collaborators could help with.

**Production cost**
Whiteboard + code: ~1 week including planning, recording (multiple takes), and editing.

**Distribution**
Unlisted YouTube link sent in due-diligence threads. Linked from a `/engineering` page on the site. NOT for cold outreach — too long, wrong audience for top-of-funnel.

---

## Production sequence (recommended)

1. **Trailer first.** Cheapest, highest reuse, unblocks all cold outreach. Days, not weeks.
2. **Walkthrough second.** Most assets exist; finish capturing SF B-roll + on-camera + demos. Ship within ~2 weeks.
3. **Pause and evaluate.** Are the first two generating technical-due-diligence requests? If yes, build the engineer video. If no, the problem isn't a missing video — it's the pitch or the targeting.

---

## Cross-cutting notes

- **Brand consistency:** all three should open with the same `LogoIntro.mp4` (5s). Locks the brand in regardless of which video a viewer sees first.
- **Captions:** all three need burned-in captions for social. Many VCs scroll with sound off.
- **End cards:** consistent across all three — `murmur · murmuralabs.com · v0.1 — [month] 2026`. Forces version-awareness.
- **Hosting:** Mux or Cloudflare Stream for embedded site playback. YouTube unlisted for shareable links. Don't host on Vimeo (compression + chrome).
