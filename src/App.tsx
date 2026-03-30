import './index.css'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Richmond', href: '#richmond' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const CAPABILITIES = [
  {
    title: '118 data fields per cell',
    desc: 'Demographics, health, pollution, housing, transit, amenities, schools, and network metrics — sourced from ACS, CalEnviroScreen, CDC PLACES, Zillow, GTFS, EPA, and OpenStreetMap.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Scenario modeling',
    desc: 'Test infrastructure changes, policy shifts, and investment scenarios. See cascading impacts across housing, health, environment, economic, mobility, education, and safety domains.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Equity-first analysis',
    desc: 'Every scenario outputs distributional impacts — who benefits, who bears the cost, displacement risk, and vulnerability propagation through the urban network.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
      </svg>
    ),
  },
  {
    title: 'Network intelligence',
    desc: 'Census tracts connected by 8 link types — commute flows, economic ties, demographic similarity, transit, schools, pollution corridors, food access, and housing pressure.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
  },
]

const STATS = [
  { value: '4,655', label: 'H3 hex cells' },
  { value: '118', label: 'data fields per cell' },
  { value: '8', label: 'real data sources' },
  { value: '7', label: 'impact domains' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-walnut">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/80 backdrop-blur-md border-b border-sand/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-espresso tracking-[0.18em] lowercase text-lg">
            murmura labs
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
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
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
      </section>

      {/* Stats bar */}
      <section className="border-y border-sand/30 bg-[#f5d9be]/40">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-3xl sm:text-4xl font-medium text-espresso">{s.value}</div>
              <div className="text-sm text-driftwood mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-24 px-6">
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
          <div className="grid sm:grid-cols-2 gap-6">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="bg-[#f5d9be]/40 border border-sand/30 rounded-xl p-6 hover:border-sand/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-espresso/10 flex items-center justify-center text-espresso mb-4">
                  {c.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-espresso mb-2">{c.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#f5d9be]/40 border-y border-sand/30">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm text-driftwood tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso mb-4">
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
                <div className="font-mono text-4xl font-medium text-sand mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg text-espresso mb-2">{item.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Richmond case study */}
      <section id="richmond" className="py-24 px-6">
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
                className="bg-espresso/5 border border-sand/30 rounded-xl p-6"
              >
                <p className="text-sm text-espresso font-medium leading-relaxed mb-4">"{item.q}"</p>
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

      {/* About / Team */}
      <section id="about" className="py-24 px-6 bg-[#f5d9be]/40 border-y border-sand/30">
        <div className="max-w-4xl mx-auto text-center">
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
            <a href="https://aretian.com" target="_blank" rel="noopener" className="text-walnut underline underline-offset-2 hover:text-espresso">
              Aretian
            </a>
            's urban analytics research, we combine complexity economics, spatial data science,
            and scenario modeling to help policymakers see the full picture before committing resources.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
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
            className="inline-flex items-center justify-center bg-espresso text-linen px-8 py-3.5 rounded-lg font-medium hover:bg-walnut transition-colors text-lg"
          >
            hello@murmuralabs.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand/30 py-10 px-6">
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
