import { useTheme } from './hooks/useTheme'
import { ThemeToggle } from './components/ThemeToggle'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Process', href: '#process' },
  { label: 'Richmond', href: '#richmond' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const STATS = [
  { value: '4,655', label: 'H3 hex cells' },
  { value: '118', label: 'data fields per cell' },
  { value: '8', label: 'real data sources' },
  { value: '7', label: 'impact domains' },
]

/* SVG network illustration for hero */
function NetworkIllustration() {
  const nodes = [
    { x: 200, y: 100 }, { x: 350, y: 60 }, { x: 500, y: 120 },
    { x: 150, y: 200 }, { x: 300, y: 180 }, { x: 450, y: 200 },
    { x: 600, y: 160 }, { x: 100, y: 300 }, { x: 250, y: 280 },
    { x: 400, y: 300 }, { x: 550, y: 280 }, { x: 650, y: 260 },
    { x: 180, y: 370 }, { x: 330, y: 360 }, { x: 480, y: 370 },
    { x: 620, y: 340 },
  ]

  const edges = [
    [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 5], [2, 6],
    [3, 7], [3, 8], [4, 8], [4, 9], [5, 9], [5, 10], [6, 10], [6, 11],
    [7, 12], [8, 12], [8, 13], [9, 13], [9, 14], [10, 14], [10, 15], [11, 15],
    [3, 4], [5, 6], [7, 8], [9, 10], [12, 13], [13, 14], [14, 15],
  ]

  return (
    <svg viewBox="0 0 750 440" className="w-full max-w-2xl mx-auto opacity-20" preserveAspectRatio="xMidYMid meet">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="currentColor" strokeWidth={1} opacity={0.5}
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 6 : 4} fill="currentColor" opacity={i % 3 === 0 ? 0.8 : 0.4} />
      ))}
    </svg>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Nav — floating over dark hero */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-bold tracking-[0.18em] lowercase text-lg text-[#ffe4cc] dark:text-espresso">
            murmura labs
          </a>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-[#a08b78] hover:text-[#ffe4cc] dark:hover:text-espresso transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            <ThemeToggle theme={theme} toggle={toggle} />
            <a
              href="#contact"
              className="hidden sm:inline-flex text-sm font-medium bg-[#ffe4cc] text-[#190f0a] dark:bg-espresso dark:text-linen px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* SLIDE 1: Hero — Dark */}
      <section className="panel-dark min-h-screen flex flex-col justify-center relative px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <NetworkIllustration />
        </div>
        <div className="relative max-w-4xl mx-auto text-center pt-16">
          <p className="font-mono text-sm opacity-50 tracking-widest uppercase mb-4">
            Urban Intelligence Platform
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-7xl leading-[1.05] mb-6">
            Listen to the city.
          </h1>
          <p className="text-lg sm:text-xl opacity-60 max-w-2xl mx-auto leading-relaxed mb-10">
            See the second-order effects of urban decisions before they're made.
            Every neighborhood, every policy, every investment — modeled across
            demographics, health, environment, housing, transit, and equity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[#ffe4cc] text-[#190f0a] dark:bg-espresso dark:text-linen px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Request a demo
            </a>
            <a
              href="#platform"
              className="inline-flex items-center justify-center border border-current/30 px-8 py-3.5 rounded-lg font-medium hover:bg-white/5 dark:hover:bg-black/5 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* SLIDE 2: Stats — Light */}
      <section className="panel-light py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-4xl sm:text-5xl font-medium">{s.value}</div>
              <div className="text-sm opacity-60 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SLIDE 3: Platform — Dark */}
      <section id="platform" className="panel-dark py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm opacity-40 tracking-widest uppercase mb-3">Platform</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              A digital twin for every neighborhood
            </h2>
            <p className="opacity-60 leading-relaxed">
              murmur.ai divides a city into H3 hexagonal cells. Each cell carries 118 real-world
              data fields from 8 authoritative sources. Apply a scenario — a new bike lane, a transit line,
              a rezoning — and the system computes cascading impacts across every cell.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: '118 data fields per cell',
                desc: 'Demographics, health, pollution, housing, transit, amenities, schools, and network metrics — sourced from ACS, CalEnviroScreen, CDC PLACES, Zillow, GTFS, EPA, and OpenStreetMap.',
              },
              {
                title: 'Scenario modeling',
                desc: 'Test infrastructure changes, policy shifts, and investment scenarios. See cascading impacts across housing, health, environment, economic, mobility, education, and safety domains.',
              },
              {
                title: 'Equity-first analysis',
                desc: 'Every scenario outputs distributional impacts — who benefits, who bears the cost, displacement risk, and vulnerability propagation through the urban network.',
              },
              {
                title: 'Network intelligence',
                desc: 'Census tracts connected by 8 link types — commute flows, economic ties, demographic similarity, transit, schools, pollution corridors, food access, and housing pressure.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="border border-current/10 rounded-xl p-6 hover:border-current/20 transition-colors"
              >
                <h3 className="font-display font-semibold text-lg mb-2">{c.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 4: Process — Light */}
      <section id="process" className="panel-light py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm opacity-40 tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              From scenario to insight in seconds
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Define the intervention',
                desc: 'Select a geographic area and change type — road closure, transit line, rezoning, congestion pricing, or investment allocation.',
              },
              {
                step: '02',
                title: 'Compute cascading impacts',
                desc: 'The engine evaluates direct effects on every affected cell, then propagates secondary impacts through spatial and network connections across 3 cascade steps.',
              },
              {
                step: '03',
                title: 'See who benefits and who bears the cost',
                desc: 'Population-weighted equity assessment across 7 domains. Displacement risk, vulnerability scores, and net impact — disaggregated by income, race, and geography.',
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="font-mono text-5xl font-medium opacity-15 mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 5: Richmond — Dark */}
      <section id="richmond" className="panel-dark py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-sm opacity-40 tracking-widest uppercase mb-3">Case Study</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Richmond, California
            </h2>
            <p className="opacity-60 leading-relaxed mb-6">
              Our first city model covers Richmond's 130,000 residents across 4,655 hexagonal cells.
              Richmond faces a historic moment: a $550M Chevron settlement, $9.56M in federal
              Reconnecting Communities funding, and the Hilltop Horizon redevelopment of 5,000-7,500 new units.
            </p>
            <p className="opacity-60 leading-relaxed">
              murmur.ai can model how each of these investments propagates through the city —
              which neighborhoods see displacement pressure, where transit improvements unlock
              job access, and how pollution corridors shift with infrastructure changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                q: 'What if $100M of the Chevron settlement goes to green infrastructure along the refinery corridor?',
                domains: ['environment', 'health', 'housing'],
              },
              {
                q: 'How does the Harbour Way complete streets project affect transit access for carless households?',
                domains: ['mobility', 'economic', 'equity'],
              },
              {
                q: 'What displacement risk does Hilltop Horizon create for renters in adjacent neighborhoods?',
                domains: ['housing', 'economic', 'safety'],
              },
            ].map((item) => (
              <div
                key={item.q}
                className="border border-current/10 rounded-xl p-6"
              >
                <p className="text-sm font-medium leading-relaxed mb-4">"{item.q}"</p>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((d) => (
                    <span key={d} className="font-mono text-xs opacity-50 border border-current/20 px-2 py-1 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 6: About — Light */}
      <section id="about" className="panel-light py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm opacity-40 tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
            Built by urban scientists
          </h2>
          <p className="opacity-60 leading-relaxed max-w-2xl mx-auto mb-4">
            Murmura Labs is an urban intelligence company building tools for cities that
            need to make consequential decisions with confidence. Our platform synthesizes
            8 authoritative data sources into a living model of neighborhood dynamics.
          </p>
          <p className="opacity-60 leading-relaxed max-w-2xl mx-auto">
            Born from{' '}
            <a href="https://aretian.com" target="_blank" rel="noopener" className="underline underline-offset-2 opacity-100 hover:opacity-80 transition-opacity">
              Aretian
            </a>
            's urban analytics research, we combine complexity economics, spatial data science,
            and scenario modeling to help policymakers see the full picture before committing resources.
          </p>
        </div>
      </section>

      {/* SLIDE 7: Contact — Dark */}
      <section id="contact" className="panel-dark py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-sm opacity-40 tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
            Let's model your city
          </h2>
          <p className="opacity-60 leading-relaxed mb-10">
            We're working with cities in the Bay Area and beyond. If you're a policymaker,
            urban planner, or community leader facing a consequential decision, we'd love
            to show you what murmur.ai can reveal.
          </p>
          <a
            href="mailto:hello@murmuralabs.com"
            className="inline-flex items-center justify-center bg-[#ffe4cc] text-[#190f0a] dark:bg-espresso dark:text-linen px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-lg"
          >
            hello@murmuralabs.com
          </a>
        </div>
      </section>

      {/* Footer — Light */}
      <footer className="panel-light py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold tracking-[0.18em] lowercase">
            murmura labs
          </div>
          <p className="text-sm opacity-50">
            &copy; {new Date().getFullYear()} Murmura Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
