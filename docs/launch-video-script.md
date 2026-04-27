# murmur — launch video script

**Total runtime:** 2:30
**Pacing:** YouTuber-style, ~2.7 words/sec average. Trim live, expand B-roll if a section runs hot.
**Talent:** Elijah Munn (founder, Murmura Labs)

---

## [0:00 — 0:20] INTRO — SF B-roll + on-camera (20s)

**Visual**

- 0:00–0:06 → Aerial SF: Bay Bridge sweep, downtown skyline, fog over the hills.
- 0:06–0:12 → Street-level: Mission storefronts, tent encampment, a "no parking" planning notice taped to a pole, a packed Muni train.
- 0:12–0:20 → Cut to Elijah on-camera, neutral background. Lower-third caption: **Elijah Munn — founder, Murmura Labs**.

**VO** (on-camera once cut lands)

> Hi, I'm Eli, I build software for cities, and I think we plan them with the wrong tools. So I built a new one.

---

## [0:20 — 0:25] LOGOINTRO (5s)

**Visual** — `LogoIntro.mp4` (silent, music swell)

**VO** — none. Let the brand land.

---

## [0:25 — 0:30] RICHMONDMAP (5s)

**Visual** — `RichmondMap.mp4`

**VO**

> Think of your city as a collection of policy makers acting on residents' interests. Here's how it works.

---

## [0:30 — 0:43] WHATISMURMUR (13s)

**Visual** — `WhatIsMurmur.mp4` (three-layer hex reveal: parcel → block → agent)

**VO** — sync to layer phases

> _(parcel layer)_ We assign as much data as possible to every cell. _(block layer)_ Then we run economic complexity models to surface how those cells interact. _(agent layer)_ Those interactions become priorities for each agent to respond accurately to changing scenarios.

---

## [0:43 — 1:28] SCENARIO 1 — Macdonald complete street (45s)

**Visual** — live screen recording of the prebaked `macdonald-complete-street` scenario at murmur.murmuralabs.com/scenarios

**Beats**

- 0:43–0:48 → Open the scenario, hover the Macdonald corridor on the map.
- 0:48–0:58 → Zoom to the redesign overlay (bike lanes, transit priority, crossings).
- 0:58–1:12 → Scrub the timeline; panels reveal pedestrian access, retail revenue, air quality.
- 1:12–1:22 → Pull back to show displacement risk shift two streets east.
- 1:22–1:28 → Resting frame on the impact dashboard.

**VO**

> Here's a real one. Richmond wants to redesign Macdonald Avenue — protected bike lanes, transit priority, pedestrian crossings. Most decks would show you a rendering. murmur shows you what the _city_ does in response. Pedestrian access climbs along the corridor. Local retail revenue shifts toward the south end. Air quality improves on these blocks. And — watch this — displacement risk ticks up two streets over. Every change ripples, and you can see exactly where.

---

## [1:28 — 2:08] SCENARIO 2 — Upzone Iron Triangle (40s)

**Visual** — live screen recording of the natural-language "new scenario" flow

**Beats**

- 1:28–1:34 → Click "+ New scenario", cursor in the text field.
- 1:34–1:42 → Type out: **"Upzone the Iron Triangle for mid-density housing."** (let the typing breathe)
- 1:42–1:48 → Compile spinner → scenario builds, parcels light up across the Iron Triangle.
- 1:48–2:02 → Outcome panels populate: units added, displacement pressure, school capacity, transit demand.
- 2:02–2:08 → Hold on the neighborhood-level summary card.

**VO**

> You can also just type one. _(types)_ "Upzone the Iron Triangle for mid-density housing." murmur compiles that into a scenario, runs the model, and shows you the second-order effects. Who gets housed. What it costs. Where the schools fill up. Who gets pushed out. Plain English in — full simulation out.

---

## [2:08 — 2:13] FORKSCENARIO (5s)

**Visual** — `ForkScenario.mp4`

**VO** — sync to the branch animation

> Fork it. Run your version. Merge what works. City planning as version control.

---

## [2:13 — 2:30] MURMURATION OUTRO (17s)

**Visual** — `Murmuration.mp4`. End-card overlay last 3s: **murmur** · murmuralabs.com · v0.1 — April 2026.

**VO**

> murmur comes out of the complexity economics tradition — Santa Fe Institute, agent-based modeling, cities as emergent systems. v0.1 ships in Richmond. Next, every coastal city facing the same fights at once. If this is your work — find me.

---

## Pacing notes

- Total VO ≈ 265 words across ~100 talking seconds in a 150s runtime → ~2.7 wps. Comfortable YouTuber cadence with ~50s of music/B-roll breathing room.
- RichmondMap VO (~6.7s) slightly overruns its 5s slot — let it bleed into the first 1–2s of WhatIsMurmur, where the parcel-layer line is short enough to absorb it.
- Intro and demo sections are the elastic ones in FCP. Pre-rendered scenes are locked.
- Both demo scenes run hot on intent — don't over-narrate dashboards. Let one or two numbers stay visible long enough to read.
- Outro is the CTA. Deliver "find me" slower than the rest, with a beat of silence before the end card.

## Asset references

| Scene        | File                              | Duration            |
| ------------ | --------------------------------- | ------------------- |
| LogoIntro    | `remotion/out/logo-intro.mp4`     | 5.0s (150f @ 30fps) |
| RichmondMap  | `remotion/out/richmond-map.mp4`   | 5.0s                |
| WhatIsMurmur | `remotion/out/what-is-murmur.mp4` | 13.0s (390f)        |
| ForkScenario | `remotion/out/fork-scenario.mp4`  | 5.0s                |
| Murmuration  | `remotion/out/murmuration.mp4`    | 12.0s (360f)        |

## Live capture shot list

- **SF B-roll (intro):** Bay Bridge aerial, Mission/SoMa street level, tent encampment wide, "planning notice" street prop tight, Muni train interior.
- **On-camera (intro):** Single static cut, neutral background, natural light. One take of the VO above; alt take with "I think we plan them with the _wrong_ tools" emphasized harder.
- **Macdonald demo:** Full screen recording at 1920×1080. Use cursor-highlight tool. Pre-load scenario before recording so the open is instant.
- **Iron Triangle demo:** Same setup. Pre-clear the NL field. Type at natural speed (~3 chars/sec) — don't paste.
