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
  { value: '4,655', label: 'H3 hex cells', sub: 'resolution 10' },
  { value: '118', label: 'data fields', sub: 'per cell' },
  { value: '8', label: 'data sources', sub: 'authoritative' },
  { value: '7', label: 'impact domains', sub: 'modeled' },
]

const CAPABILITIES = [
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
]

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen gradient-bg text-walnut transition-colors duration-300">
      {/* Nav — glass */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-colors duration-300">
        <div className="glass mx-4 mt-3 rounded-xl">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-display font-bold text-espresso tracking-[0.18em] lowercase text-lg">
              murmura labs
            </a>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-6">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm text-driftwood hover:text-espresso transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
              <ThemeToggle theme={theme} toggle={toggle} />
              <a
                href="#contact"
                className="hidden sm:inline-flex text-sm font-medium bg-espresso text-linen px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-4">
            Urban Intelligence Platform
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-7xl text-espresso leading-[1.05] mb-6">
            Listen to the city.
          </h1>
          <p className="text-lg sm:text-xl text-driftwood max-w-2xl mx-auto leading-relaxed mb-10">
            See the second-order effects of urban decisions before they're made.
            Every neighborhood, every policy, every investment — modeled across
            demographics, health, environment, housing, transit, and equity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Request a demo
            </a>
            <a
              href="#platform"
              className="inline-flex items-center justify-center glass rounded-xl px-8 py-3.5 font-medium text-walnut hover:bg-sand/20 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats — dashboard style glass cards */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass glass-hover rounded-xl p-5 text-center">
              <div className="font-mono text-3xl sm:text-4xl font-medium text-espresso">{s.value}</div>
              <div className="text-sm text-driftwood mt-1">{s.label}</div>
              <div className="font-mono text-xs text-sand mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Platform</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              A digital twin for every neighborhood
            </h2>
            <p className="text-driftwood leading-relaxed">
              murmur.ai divides a city into H3 hexagonal cells. Each cell carries 118 real-world
              data fields from 8 authoritative sources. Apply a scenario — a new bike lane, a transit line,
              a rezoning — and the system computes cascading impacts across every cell.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CAPABILITIES.map((c, i) => (
              <div key={c.title} className="glass glass-hover rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-driftwood w-7 h-7 rounded-lg flex items-center justify-center bg-espresso/8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-espresso">{c.title}</h3>
                </div>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-12">
              From scenario to insight in seconds
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
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
                  <div className="font-mono text-4xl font-medium text-sand/50 mb-4">{item.step}</div>
                  <h3 className="font-display font-semibold text-lg text-espresso mb-2">{item.title}</h3>
                  <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Richmond */}
      <section id="richmond" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Case Study</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
              Richmond, California
            </h2>
            <p className="text-driftwood leading-relaxed mb-6">
              Our first city model covers Richmond's 130,000 residents across 4,655 hexagonal cells.
              Richmond faces a historic moment: a $550M Chevron settlement, $9.56M in federal
              Reconnecting Communities funding, and the Hilltop Horizon redevelopment of 5,000-7,500 new units.
            </p>
            <p className="text-driftwood leading-relaxed">
              murmur.ai can model how each of these investments propagates through the city —
              which neighborhoods see displacement pressure, where transit improvements unlock
              job access, and how pollution corridors shift with infrastructure changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
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
              <div key={item.q} className="glass glass-hover rounded-xl p-6">
                <p className="text-sm text-espresso font-medium leading-relaxed mb-4">"{item.q}"</p>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((d) => (
                    <span key={d} className="font-mono text-xs text-driftwood bg-espresso/8 px-2 py-1 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto text-center">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">About</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-6">
              Built by urban scientists
            </h2>
            <p className="text-driftwood leading-relaxed max-w-2xl mx-auto mb-4">
              Murmura Labs is an urban intelligence company building tools for cities that
              need to make consequential decisions with confidence. Our platform synthesizes
              8 authoritative data sources into a living model of neighborhood dynamics.
            </p>
            <p className="text-driftwood leading-relaxed max-w-2xl mx-auto">
              Born from{' '}
              <a href="https://aretian.com" target="_blank" rel="noopener" className="text-espresso underline underline-offset-2 hover:text-walnut transition-colors">
                Aretian
              </a>
              's urban analytics research, we combine complexity economics, spatial data science,
              and scenario modeling to help policymakers see the full picture before committing resources.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-6">
            Let's model your city
          </h2>
          <p className="text-driftwood leading-relaxed mb-10">
            We're working with cities in the Bay Area and beyond. If you're a policymaker,
            urban planner, or community leader facing a consequential decision, we'd love
            to show you what murmur.ai can reveal.
          </p>
          <a
            href="mailto:hello@murmuralabs.com"
            className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-lg"
          >
            hello@murmuralabs.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6">
        <div className="glass rounded-xl mx-auto max-w-6xl">
          <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-display font-bold text-espresso tracking-[0.18em] lowercase">
              murmura labs
            </div>
            <p className="text-sm text-driftwood">
              &copy; {new Date().getFullYear()} Murmura Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
