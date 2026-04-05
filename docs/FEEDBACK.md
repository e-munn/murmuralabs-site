# Advisor Feedback Log

Organized by round. Each entry captures who said what, what it means for the product, and status.

---

## Round 1 — April 2026

### Timi

**Pitch deck slide 5: "Deliver on what?"**
- The "doesn't exist yet" punchline had no setup — audience doesn't know what "this" refers to
- Suggested: add framing like "we deserve a better way to make decisions and see second-order effects"
- Suggested: show concrete example questions (effect of zoning on child health, school disruption tradeoff, etc.)
- **Status:** Fixed — added framing statement + 3 example questions to slide 4

### Josh

**1. Agent simulation transparency / trust**
- Pitch says "agent-based simulation" but the Richmond engine is a cell-agency response model
- City planners will be suspicious if they can't see how conclusions are reached
- Suggested: either update pitch to match reality, or build agent sim for Richmond
- Suggested: "show your work" explainability layer per cell
- **Status:** Open

**2. No interactive levers**
- User picks a pre-built scenario and reads a report — feels passive/read-only
- Expected: parameter sliders, draw-your-own scenario, tweak-and-watch feedback loop
- The interaction pattern should be: pull lever, watch city respond
- **Status:** Open

**3. Cell click doesn't update report**
- Clicking a cell shows cell details but doesn't filter or contextualize the analysis output
- Expected the report to change when selecting a cell
- **Status:** Open (not implemented)

**4. Utilitarian calculation concern**
- Net score is a single weighted sum — is summing harm/good units the right framework?
- Equity analysis needs distributional decomposition, not just averages
- Counterfactual comparison (Phase 5) with "positive for whom, negative for whom" would address this
- **Status:** Open (roadmap Phase 5)

**5. IP question**
- Asked whether this is a solo offshoot or with existing group, and whether reusing prior work creates IP issues
- **Status:** Needs answer from Elijah

### Nate

**"Go full Palantir" — own the data pipeline**
- The real moat isn't the analysis layer, it's owning proprietary data collection
- Public data (ACS, CDC, etc.) is commodity — anyone can build on it
- Suggested: get government contracts to deploy sensors, run surveys, collect real-time data that public sources don't have (those lag 1-2 years)
- The analytics platform becomes sticky when it's the only thing that can read the data you collected
- **Grain of salt:** Palantir model requires massive contracts, long sales cycles, heavy compliance — very different company than a software product
- **Useful kernel:** even without going full Palantir, a real-time data layer on top of public data (e.g. partnering with cities that have existing sensor networks) would be a differentiator
- **Status:** Strategic consideration — not actionable yet
