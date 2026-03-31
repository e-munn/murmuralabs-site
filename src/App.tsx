import './index.css'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Science', href: '#science' },
  { label: 'Richmond', href: '#richmond' },
  { label: 'About', href: '#about' },
]

const CAPABILITIES = [
  {
    title: '118 data fields per cell',
    desc: 'Demographics, health, pollution, housing, transit, amenities, schools, and network metrics — from ACS, CalEnviroScreen, CDC PLACES, Zillow, GTFS, EPA, and OpenStreetMap.',
    tag: 'data',
  },
  {
    title: 'Empirically-calibrated response engine',
    desc: 'Every coefficient is derived from observed cross-field correlations, not assumed. Distribution percentiles replace magic-number thresholds. Bootstrap confidence intervals on every domain shift.',
    tag: 'calibration',
  },
  {
    title: 'Network-informed cascade',
    desc: '8 link types connect neighborhoods: commute flows, economic ties, demographic similarity, transit, schools, pollution corridors, food access, housing pressure. Effects propagate along real relationships, not just distance.',
    tag: 'network',
  },
  {
    title: 'Counterfactual comparison',
    desc: 'Fork reality: baseline distribution vs scenario distribution per domain. Paired t-tests with Bonferroni correction. Cohen\'s d effect sizes. KDE density plots. 95% bootstrap confidence intervals.',
    tag: 'statistics',
  },
  {
    title: 'Equity decomposition',
    desc: 'Income quartile breakdowns. Vulnerability tier analysis. Progressivity index (Spearman). Impact Gini coefficient. Displacement risk with destination modeling.',
    tag: 'equity',
  },
  {
    title: 'Spatial clustering',
    desc: 'Moran\'s I for global autocorrelation. Getis-Ord Gi* for local hot/cold spots. Impacts that cluster geographically are flagged — random scatter means the signal is noise.',
    tag: 'spatial',
  },
]

const STATS = [
  { value: '4,655', label: 'H3 hex cells', sub: 'resolution 10 (~65m)' },
  { value: '118', label: 'data fields', sub: 'per cell' },
  { value: '8', label: 'change types', sub: 'infrastructure to policy' },
  { value: '29', label: 'tract network', sub: '8 link types' },
]

const PIPELINE = [
  {
    step: '01',
    title: 'Census data → Cell profiles',
    desc: '118 fields from 8 sources mapped to 4,655 H3 hexagonal cells. Dasymetric disaggregation ensures sub-block-group variation.',
    time: '~2s',
  },
  {
    step: '02',
    title: 'Statistical calibration',
    desc: 'Distribution percentiles, cross-field correlations, and ABC-sampled posterior distributions replace all hard-coded parameters.',
    time: '~50ms',
  },
  {
    step: '03',
    title: 'Tract network construction',
    desc: '8-link-type network with Brandes betweenness centrality and compound vulnerability scoring. Calibrated link affinity from cross-tract correlations.',
    time: '~10ms',
  },
  {
    step: '04',
    title: 'Direct impact computation',
    desc: 'Each affected cell responds based on its full 118-field profile. 7 impact domains × magnitude × direction. Displacement probability from empirical weights.',
    time: '~100ms',
  },
  {
    step: '05',
    title: 'Network cascade propagation',
    desc: 'Effects cascade along tract network links for 3 steps. Hub tracts amplify. Vulnerable tracts absorb more damage. Per-cascade-type vulnerability modifiers.',
    time: '~30ms',
  },
  {
    step: '06',
    title: 'Counterfactual comparison',
    desc: 'Fork baseline → apply scenario → paired t-test per domain → bootstrap CIs → Moran\'s I spatial clustering → equity decomposition by income quartile.',
    time: '~200ms',
  },
]

const SCENARIO_RESULTS = [
  {
    name: 'Bike lane: Macdonald Avenue',
    type: 'add_bike_lane',
    score: '+0.068',
    scoreColor: '#16a34a',
    benefited: '14,455',
    harmed: '0',
    progressive: '+0.288',
    insight: 'Q1 (lowest income) gets 4× the benefit of Q4. Carless residents in Iron Triangle gain the most from protected cycling access.',
  },
  {
    name: 'Pedestrian bridge: over I-580',
    type: 'pedestrianization',
    score: '+0.119',
    scoreColor: '#16a34a',
    benefited: '20,466',
    harmed: '0',
    displacement: '546',
    progressive: '+0.099',
    insight: 'Reconnecting Iron Triangle to Marina Bay across the freeway barrier. Highest net score of any tested scenario. Displacement risk concentrated on the rent-burdened Iron Triangle side.',
  },
  {
    name: 'I-580 truck restriction',
    type: 'truck_restriction',
    score: 'testing',
    scoreColor: '#0284c7',
    benefited: '—',
    harmed: '—',
    progressive: '—',
    insight: 'Tests the pollution↔health correlation (r=0.42). Air quality cascade propagates along pollution network links. No traffic diversion — only trucks are rerouted.',
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-walnut">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/80 backdrop-blur-md border-b border-sand/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-espresso tracking-[0.18em] lowercase text-lg">
            murmur
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-driftwood hover:text-espresso transition-colors">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm font-medium bg-espresso text-linen px-4 py-2 rounded-lg hover:bg-walnut transition-colors"
            >
              Request demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-4">
            City Intelligence Platform
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-7xl text-espresso leading-[1.05] mb-6">
            See the second-order<br />effects first.
          </h1>
          <p className="text-lg sm:text-xl text-driftwood max-w-2xl mx-auto leading-relaxed mb-10">
            Every urban decision creates cascading impacts across neighborhoods.
            murmur computes them — with statistical confidence — before a single
            dollar is spent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-lg font-medium hover:bg-walnut transition-colors"
            >
              Request a demo
            </a>
            <a
              href="#science"
              className="inline-flex items-center justify-center border border-sand text-walnut px-8 py-3.5 rounded-lg font-medium hover:bg-sand/20 transition-colors"
            >
              The science
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-sand/30 bg-[#f5d9be]/40">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-3xl sm:text-4xl font-medium text-espresso">{s.value}</div>
              <div className="text-sm text-driftwood mt-1">{s.label}</div>
              <div className="text-xs text-sand mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform capabilities */}
      <section id="platform" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Platform</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              Not a dashboard. A computation engine.
            </h2>
            <p className="text-driftwood leading-relaxed">
              Most urban analytics tools visualize data. murmur <em>reasons</em> about it — computing
              how interventions propagate through 4,655 cells across 7 domains, with empirically-calibrated
              coefficients and statistical significance testing on every output.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="bg-[#f5d9be]/40 border border-sand/30 rounded-xl p-6 hover:border-sand/60 transition-colors"
              >
                <span className="font-mono text-[10px] text-driftwood bg-sand/20 px-2 py-1 rounded uppercase tracking-wider">
                  {c.tag}
                </span>
                <h3 className="font-display font-semibold text-lg text-espresso mt-3 mb-2">{c.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science — The Pipeline */}
      <section id="science" className="py-24 px-6 bg-[#f5d9be]/40 border-y border-sand/30">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Science</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              Six-stage analysis pipeline
            </h2>
            <p className="text-driftwood leading-relaxed">
              Inspired by J. Doyne Farmer's complexity economics at the Oxford Institute for New
              Economic Thinking. Calibrate against distributions, not means. Compare counterfactuals,
              not absolutes. Let spatial structure carry information.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PIPELINE.map((item) => (
              <div key={item.step}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-3xl font-medium text-sand">{item.step}</span>
                  <span className="font-mono text-xs text-driftwood bg-sand/20 px-2 py-0.5 rounded">{item.time}</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-espresso mb-2">{item.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Richmond case study with real results */}
      <section id="richmond" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Case Study</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              Richmond, California
            </h2>
            <p className="text-driftwood leading-relaxed mb-4">
              130,000 residents. 4,655 hex cells. 118 fields per cell.
              Richmond faces a $550M Chevron settlement, $9.56M in federal Reconnecting
              Communities funding, and the Hilltop Horizon redevelopment. murmur models how
              each investment cascades through the city's neighborhoods.
            </p>
            <p className="text-driftwood leading-relaxed">
              Here are real outputs from the platform — not mockups.
            </p>
          </div>

          <div className="space-y-4">
            {SCENARIO_RESULTS.map((s) => (
              <div
                key={s.name}
                className="bg-[#f5d9be]/40 border border-sand/30 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-espresso">{s.name}</h3>
                    <span className="font-mono text-xs text-driftwood bg-sand/20 px-2 py-0.5 rounded">
                      {s.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold" style={{ color: s.scoreColor }}>
                        {s.score}
                      </div>
                      <div className="text-xs text-driftwood">net city score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="font-mono text-sm font-medium text-canopy">{s.benefited}</div>
                    <div className="text-xs text-driftwood">benefited</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium" style={{ color: s.harmed === '0' ? '#16a34a' : '#dc2626' }}>{s.harmed}</div>
                    <div className="text-xs text-driftwood">harmed</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-sky">{s.progressive}</div>
                    <div className="text-xs text-driftwood">progressivity</div>
                  </div>
                  {s.displacement && (
                    <div>
                      <div className="font-mono text-sm font-medium text-ember">{s.displacement}</div>
                      <div className="text-xs text-driftwood">displacement risk</div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-driftwood leading-relaxed italic">
                  {s.insight}
                </p>
              </div>
            ))}
          </div>

          {/* Questions the platform can answer */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              'What if $100M of the Chevron settlement goes to green infrastructure along the refinery corridor?',
              'How does the Harbour Way complete streets project affect displacement risk for rent-burdened households?',
              'Which neighborhoods see cascading health improvements when truck traffic is restricted from residential streets?',
            ].map((q) => (
              <div key={q} className="bg-espresso/5 border border-sand/30 rounded-xl p-5">
                <p className="text-sm text-espresso font-medium leading-relaxed">"{q}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 px-6 bg-[#f5d9be]/40 border-y border-sand/30">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Methodology</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              Complexity economics for cities
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                principle: 'Calibrate against distributions, not means.',
                detail: 'Median income tells you little — the full distribution determines how a policy lands. Every analysis outputs distributional impacts with confidence intervals.',
              },
              {
                principle: 'Counterfactual comparison as first-class operation.',
                detail: 'The question is never "what happens?" but "what happens differently than baseline?" with paired t-tests, effect sizes, and Bonferroni-corrected significance.',
              },
              {
                principle: 'Spatial structure carries information.',
                detail: 'Network position determines how effects propagate. High-betweenness tracts amplify shocks. Isolated tracts absorb them. Cascade follows real connectivity.',
              },
              {
                principle: 'Approximate Bayesian Calibration.',
                detail: 'Response coefficients derived from observed cross-sectional correlations with posterior distributions. Not assumed from literature — computed from Richmond\'s 4,655-cell dataset.',
              },
            ].map((p) => (
              <div key={p.principle} className="flex gap-6">
                <div className="w-1 shrink-0 rounded-full bg-espresso/20" />
                <div>
                  <h3 className="font-display font-semibold text-espresso mb-1">{p.principle}</h3>
                  <p className="text-sm text-driftwood leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-6">
            Built by urban scientists
          </h2>
          <p className="text-driftwood leading-relaxed max-w-2xl mx-auto mb-4">
            Murmura Labs builds computation engines for cities facing consequential decisions.
            We synthesize 8 authoritative data sources into a living model of neighborhood dynamics —
            with every coefficient empirically grounded and every output statistically tested.
          </p>
          <p className="text-driftwood leading-relaxed max-w-2xl mx-auto">
            Born from{' '}
            <a href="https://aretian.com" target="_blank" rel="noopener" className="text-walnut underline underline-offset-2 hover:text-espresso">
              Aretian
            </a>
            's urban analytics research, informed by J. Doyne Farmer's complexity economics
            at the Oxford Institute for New Economic Thinking.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-[#f5d9be]/40 border-y border-sand/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-6">
            Model your city's next decision
          </h2>
          <p className="text-driftwood leading-relaxed mb-10">
            We work with city governments, planning agencies, and community organizations
            facing infrastructure, transit, housing, and environmental justice decisions.
          </p>
          <a
            href="mailto:hello@murmuralabs.com"
            className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-lg font-medium hover:bg-walnut transition-colors text-lg"
          >
            hello@murmuralabs.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold text-espresso tracking-[0.18em] lowercase">
            murmura labs
          </div>
          <p className="text-sm text-driftwood">
            &copy; {new Date().getFullYear()} Murmura Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
