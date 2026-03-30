import { useTheme } from './hooks/useTheme'
import { ThemeToggle } from './components/ThemeToggle'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Process', href: '#process' },
  { label: 'Richmond', href: '#richmond' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-linen text-walnut transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/90 backdrop-blur-md border-b border-sand/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

      {/* Hero — editorial asymmetric layout */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-4">
              Urban Intelligence Platform
            </p>
            <h1 className="font-display font-bold text-5xl sm:text-7xl text-espresso leading-[0.95] tracking-tight mb-8">
              Listen to
              <br />
              the city.
            </h1>
            <p className="text-lg text-driftwood leading-relaxed max-w-lg mb-10">
              See the second-order effects of urban decisions before they're made.
              Every neighborhood, every policy, every investment — modeled across
              demographics, health, environment, housing, transit, and equity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-lg font-medium hover:bg-walnut transition-colors"
              >
                Request a demo
              </a>
              <a
                href="#platform"
                className="inline-flex items-center justify-center border border-sand text-walnut px-8 py-3.5 rounded-lg font-medium hover:bg-sand/20 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
          {/* Visual placeholder — large editorial image area */}
          <div className="hidden sm:flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl bg-sand/15 border border-sand/20 flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-5xl font-medium text-espresso">4,655</div>
                <div className="text-sm text-driftwood mt-2">hexagonal cells</div>
                <div className="font-mono text-5xl font-medium text-espresso mt-6">118</div>
                <div className="text-sm text-driftwood mt-2">data fields each</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="border-y border-sand/30 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <blockquote className="font-editorial text-2xl sm:text-3xl text-espresso leading-relaxed italic">
            "You can run 50 allocation scenarios in an afternoon — something that
            would take a consulting firm six months and a million dollars."
          </blockquote>
        </div>
      </section>

      {/* Section 1: Platform — asymmetric */}
      <section id="platform" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div className="sticky top-24">
            <div className="section-numeral">1</div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mt-4 mb-3">Platform</p>
            <h2 className="font-display font-bold text-3xl text-espresso leading-tight mb-4">
              A digital twin for every neighborhood
            </h2>
            <p className="text-driftwood leading-relaxed">
              murmur.ai divides a city into H3 hexagonal cells. Each cell carries 118 real-world
              data fields from 8 authoritative sources. Apply a scenario and the system computes
              cascading impacts across every cell.
            </p>
          </div>
          <div className="space-y-6">
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
              <div key={c.title} className="border-l-2 border-sand/40 pl-6 py-2">
                <h3 className="font-display font-semibold text-lg text-espresso mb-2">{c.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote 2 */}
      <section className="border-y border-sand/30 py-16 px-6 bg-sand/8">
        <div className="max-w-5xl mx-auto">
          <blockquote className="font-editorial text-2xl sm:text-3xl text-espresso leading-relaxed italic">
            "Every scenario outputs distributional impacts — who benefits,
            who bears the cost."
          </blockquote>
        </div>
      </section>

      {/* Section 2: Process */}
      <section id="process" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-[1.5fr_1fr] gap-16 items-start">
          <div className="order-2 sm:order-1">
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
                  <div className="font-editorial text-5xl text-sand/50 leading-none shrink-0 w-16 text-right">{item.step}</div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-espresso mb-2">{item.title}</h3>
                    <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 sm:order-2 sticky top-24">
            <div className="section-numeral">2</div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mt-4 mb-3">Process</p>
            <h2 className="font-display font-bold text-3xl text-espresso leading-tight">
              From scenario to insight in seconds
            </h2>
          </div>
        </div>
      </section>

      {/* Section 3: Richmond — asymmetric */}
      <section id="richmond" className="py-28 px-6 border-t border-sand/30">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div className="sticky top-24">
            <div className="section-numeral">3</div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mt-4 mb-3">Case Study</p>
            <h2 className="font-display font-bold text-3xl text-espresso leading-tight mb-4">
              Richmond, California
            </h2>
            <p className="text-driftwood leading-relaxed mb-4">
              Our first city model covers Richmond's 130,000 residents across 4,655 hexagonal cells.
            </p>
            <p className="text-driftwood leading-relaxed">
              Richmond faces a historic moment: a $550M Chevron settlement, $9.56M in federal
              Reconnecting Communities funding, and the Hilltop Horizon redevelopment of 5,000-7,500 new units.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-driftwood leading-relaxed">
              murmur.ai can model how each of these investments propagates through the city —
              which neighborhoods see displacement pressure, where transit improvements unlock
              job access, and how pollution corridors shift with infrastructure changes.
            </p>
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
              <div key={item.q} className="border-l-2 border-sand/40 pl-6 py-3">
                <p className="text-sm text-espresso font-medium leading-relaxed mb-3 font-editorial italic">
                  "{item.q}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((d) => (
                    <span key={d} className="font-mono text-xs text-driftwood bg-sand/15 px-2 py-1 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote 3 */}
      <section className="border-y border-sand/30 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <blockquote className="font-editorial text-2xl sm:text-3xl text-espresso leading-relaxed italic">
            "Which neighborhoods see displacement pressure, where transit
            improvements unlock job access."
          </blockquote>
        </div>
      </section>

      {/* Section 4: About */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-[1.5fr_1fr] gap-16 items-start">
          <div className="order-2 sm:order-1">
            <p className="text-driftwood leading-relaxed mb-6 text-lg">
              Murmura Labs is an urban intelligence company building tools for cities that
              need to make consequential decisions with confidence. Our platform synthesizes
              8 authoritative data sources into a living model of neighborhood dynamics.
            </p>
            <p className="text-driftwood leading-relaxed text-lg">
              Born from{' '}
              <a href="https://aretian.com" target="_blank" rel="noopener" className="text-espresso underline underline-offset-2 hover:text-walnut transition-colors">
                Aretian
              </a>
              's urban analytics research, we combine complexity economics, spatial data science,
              and scenario modeling to help policymakers see the full picture before committing resources.
            </p>
          </div>
          <div className="order-1 sm:order-2 sticky top-24">
            <div className="section-numeral">4</div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mt-4 mb-3">About</p>
            <h2 className="font-display font-bold text-3xl text-espresso leading-tight">
              Built by urban scientists
            </h2>
          </div>
        </div>
      </section>

      {/* Section 5: Contact */}
      <section id="contact" className="py-28 px-6 border-t border-sand/30">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div>
            <div className="section-numeral">5</div>
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mt-4 mb-3">Contact</p>
            <h2 className="font-display font-bold text-3xl text-espresso leading-tight">
              Let's model your city
            </h2>
          </div>
          <div>
            <p className="text-driftwood leading-relaxed mb-10 text-lg">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand/30 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
