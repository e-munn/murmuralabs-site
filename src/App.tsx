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

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-linen text-walnut transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/90 backdrop-blur-md border-b border-sand/30 transition-colors duration-300">
        <div className="max-w-[680px] mx-auto px-6 h-16 flex items-center justify-between">
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
          </div>
        </div>
      </nav>

      {/* Hero — massive typography, nothing else */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <h1 className="font-display font-bold text-6xl sm:text-8xl text-espresso leading-[0.95] tracking-tight mb-8">
            Listen to
            <br />
            the city.
          </h1>
          <p className="text-lg sm:text-xl text-driftwood leading-relaxed max-w-[520px] mb-16">
            See the second-order effects of urban decisions before they're made.
            Every neighborhood, every policy, every investment — modeled across
            demographics, health, environment, housing, transit, and equity.
          </p>

          {/* Persona CTAs */}
          <div className="space-y-3">
            <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-4">
              I am a...
            </p>
            {[
              { role: 'City Manager', desc: 'Allocate $550M across neighborhoods with confidence.' },
              { role: 'Urban Planner', desc: 'Model rezoning, transit, and infrastructure scenarios.' },
              { role: 'Community Leader', desc: 'See displacement risk before development begins.' },
            ].map((cta) => (
              <a
                key={cta.role}
                href="#contact"
                className="group flex items-center justify-between py-4 border-b border-sand/30 hover:border-espresso/40 transition-colors"
              >
                <div>
                  <span className="text-espresso font-medium">{cta.role}</span>
                  <span className="text-driftwood text-sm ml-3">{cta.desc}</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-sand group-hover:text-espresso transition-colors shrink-0 ml-4">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-[680px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-3xl sm:text-4xl font-medium text-espresso">{s.value}</div>
              <div className="text-sm text-driftwood mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* Platform */}
      <section id="platform" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-3">Platform</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight mb-6">
            A digital twin for every neighborhood
          </h2>
          <p className="text-driftwood leading-relaxed mb-12">
            murmur.ai divides a city into H3 hexagonal cells. Each cell carries 118 real-world
            data fields from 8 authoritative sources. Apply a scenario — a new bike lane, a transit line,
            a rezoning — and the system computes cascading impacts across every cell.
          </p>

          <div className="space-y-10">
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
            ].map((c, i) => (
              <div key={c.title} className="group">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-mono text-sm text-sand">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-semibold text-lg text-espresso">{c.title}</h3>
                </div>
                <p className="text-sm text-driftwood leading-relaxed pl-10">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* Process */}
      <section id="process" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-3">Process</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight mb-12">
            From scenario to insight in seconds
          </h2>

          <div className="space-y-12">
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
              <div key={item.step} className="flex gap-6">
                <div className="font-mono text-5xl font-medium text-sand/60 leading-none shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-espresso mb-2">{item.title}</h3>
                  <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* Richmond */}
      <section id="richmond" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-3">Case Study</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight mb-6">
            Richmond, California
          </h2>
          <p className="text-driftwood leading-relaxed mb-6">
            Our first city model covers Richmond's 130,000 residents across 4,655 hexagonal cells.
            Richmond faces a historic moment: a $550M Chevron settlement, $9.56M in federal
            Reconnecting Communities funding, and the Hilltop Horizon redevelopment of 5,000-7,500 new units.
          </p>
          <p className="text-driftwood leading-relaxed mb-12">
            murmur.ai can model how each of these investments propagates through the city —
            which neighborhoods see displacement pressure, where transit improvements unlock
            job access, and how pollution corridors shift with infrastructure changes.
          </p>

          <div className="space-y-6">
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
              <div key={item.q} className="py-6 border-b border-sand/30">
                <p className="text-espresso font-medium leading-relaxed mb-3">"{item.q}"</p>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((d) => (
                    <span key={d} className="font-mono text-xs text-driftwood bg-sand/20 px-2 py-1 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight mb-6">
            Built by urban scientists
          </h2>
          <p className="text-driftwood leading-relaxed mb-4">
            Murmura Labs is an urban intelligence company building tools for cities that
            need to make consequential decisions with confidence. Our platform synthesizes
            8 authoritative data sources into a living model of neighborhood dynamics.
          </p>
          <p className="text-driftwood leading-relaxed">
            Born from{' '}
            <a href="https://aretian.com" target="_blank" rel="noopener" className="text-espresso underline underline-offset-2 hover:text-walnut transition-colors">
              Aretian
            </a>
            's urban analytics research, we combine complexity economics, spatial data science,
            and scenario modeling to help policymakers see the full picture before committing resources.
          </p>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-sand/30 max-w-[680px] mx-auto" />

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <p className="font-mono text-xs text-driftwood/60 tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight mb-6">
            Let's model your city
          </h2>
          <p className="text-driftwood leading-relaxed mb-10">
            We're working with cities in the Bay Area and beyond. If you're a policymaker,
            urban planner, or community leader facing a consequential decision, we'd love
            to show you what murmur.ai can reveal.
          </p>
          <a
            href="mailto:hello@murmuralabs.com"
            className="inline-flex items-center text-espresso font-medium border-b-2 border-espresso pb-1 hover:border-driftwood hover:text-driftwood transition-colors text-lg"
          >
            hello@murmuralabs.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 ml-2">
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand/30 py-10 px-6">
        <div className="max-w-[680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
