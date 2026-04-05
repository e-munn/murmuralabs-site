# Session Handoff — 2026-04-05

## What was done this session
- **Pitch deck slide 4 (problem slide):** Added "The Problem" header, framing statement ("We deserve a better way to make decisions and see second-order effects"), and 3 concrete example questions before the "doesn't exist yet" punchline. This addresses Timi's feedback that the slide had no setup.
- **Richmond outreach plan (`docs/richmond-outreach-plan.md`):** Replaced all Aretian/MIT references with neutral language ("network science and urban complexity research") across all email templates and talking points.
- **Created `docs/FEEDBACK.md`:** Advisor feedback log capturing Round 1 feedback from Timi (slide 5 setup issue — fixed) and Josh (agent simulation transparency, lack of interactive levers — both open).
- **Created `docs/legal.md`:** IP/non-compete risk assessment for Murmura Labs spinoff, covering signed agreements, IP ownership risks, spinoff paths, data licensing, and entity formation.
- **Created `docs/networking-sf-urban-data.md`:** SF Bay Area urban data networking guide with specific contacts, events, and organizations for civic tech outreach (OpenOakland, BAAQMD, Richmond Planning, SF Civic Tech, etc.).

## Current state
- Site deploys and works on Vercel. Pitch deck is functional at `/pitch`.
- Pitch deck problem slide (slide 4) now has proper setup before the punchline.
- Outreach emails are debranded from Aretian references.
- Two open product issues from Josh's feedback: (1) agent simulation transparency/trust, (2) no interactive levers (parameter sliders, draw-your-own scenario).

## Next steps (priority order)
1. **Address Josh's feedback — interactive levers:** Build parameter sliders or scenario customization into the Richmond demo so users can tweak inputs and watch the city respond, rather than just reading pre-built scenario reports.
2. **Address Josh's feedback — simulation transparency:** Add a "show your work" explainability layer per cell, or update pitch language to accurately describe the cell-agency response model rather than calling it "agent-based simulation."
3. **Execute Richmond outreach:** Follow the timeline in `docs/richmond-outreach-plan.md` — warm intro to Jason Corburn, then email sequence to city officials.
4. **Attend networking events:** OpenOakland Civic Hack Night (Tue Apr 7), SF Civic Tech Wednesday Hack Night — see `docs/networking-sf-urban-data.md`.
5. **Legal next steps:** Consult an employment attorney re: IP assignment and non-compete provisions documented in `docs/legal.md`.

## Key decisions made
- Removed all Aretian/MIT branding from outreach materials, replaced with neutral "network science and urban complexity" framing.
- Pitch deck problem slide restructured to lead with the user's pain point before introducing the product gap.

## Open questions
- Should the pitch deck describe the Richmond engine as "agent-based simulation" or "cell-agency response model"? Josh flagged the mismatch.
- How far to go with interactive levers for the Richmond demo — full parameter sliders, or a simpler "choose your own scenario" approach first?
