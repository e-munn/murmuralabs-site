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

const CAPABILITIES = [
  {
    title: '118 data fields per cell',
    desc: 'Demographics, health, pollution, housing, transit, amenities, schools, and network metrics — sourced from ACS, CalEnviroScreen, CDC PLACES, Zillow, GTFS, EPA, and OpenStreetMap.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="14" height="14" rx="3" stroke="currentColor" strokeWidth={1.5} />
        <rect x="22" y="4" width="14" height="14" rx="3" stroke="currentColor" strokeWidth={1.5} />
        <rect x="4" y="22" width="14" height="14" rx="3" stroke="currentColor" strokeWidth={1.5} />
        <rect x="22" y="22" width="14" height="14" rx="3" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="11" cy="11" r="2" fill="currentColor" opacity={0.4} />
        <circle cx="29" cy="11" r="2" fill="currentColor" opacity={0.4} />
        <circle cx="11" cy="29" r="2" fill="currentColor" opacity={0.4} />
        <circle cx="29" cy="29" r="2" fill="currentColor" opacity={0.4} />
      </svg>
    ),
  },
  {
    title: 'Scenario modeling',
    desc: 'Test infrastructure changes, policy shifts, and investment scenarios. See cascading impacts across housing, health, environment, economic, mobility, education, and safety domains.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 6v12M14 12l6-6 6 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 22h24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
        <path d="M12 28l4 4 4-4 4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Equity-first analysis',
    desc: 'Every scenario outputs distributional impacts — who benefits, who bears the cost, displacement risk, and vulnerability propagation through the urban network.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 6v28" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M10 14l10-4 10 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="4" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="30" cy="20" r="4" stroke="currentColor" strokeWidth={1.5} />
        <path d="M10 24v4M30 24v4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
      </svg>
    ),
  },
  {
    title: 'Network intelligence',
    desc: 'Census tracts connected by 8 link types — commute flows, economic ties, demographic similarity, transit, schools, pollution corridors, food access, and housing pressure.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="10" cy="30" r="3" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="30" cy="30" r="3" stroke="currentColor" strokeWidth={1.5} />
        <path d="M18 12.5L12 27.5M22 12.5L28 27.5M13 30H27" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      </svg>
    ),
  },
]

/* Generate hex grid positions for hero background */
function HexGrid() {
  const hexes: { cx: number; cy: number; delay: number }[] = []
  const size = 28
  const hSpacing = size * 1.75
  const vSpacing = size * 1.52
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 16; col++) {
      const offset = row % 2 === 0 ? 0 : hSpacing / 2
      hexes.push({
        cx: col * hSpacing + offset,
        cy: row * vSpacing,
        delay: (row * 16 + col) * 0.15,
      })
    }
  }

  return (
    <svg
      viewBox="-20 -20 740 520"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {hexes.map((h, i) => (
        <polygon
          key={i}
          points={hexPoints(h.cx, h.cy, size)}
          fill="currentColor"
          className="hex-cell text-espresso"
          style={{ animationDelay: `${h.delay % 6}s` }}
        />
      ))}
    </svg>
  )
}

function hexPoints(cx: number, cy: number, size: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    pts.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`)
  }
  return pts.join(' ')
}

function AngleDivider({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <div className={`relative h-16 sm:h-24 ${className ?? ''}`}>
      <svg
        viewBox="0 0 1440 96"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
      >
        <polygon points="0,0 1440,0 1440,48 0,96" fill="currentColor" />
      </svg>
    </div>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-linen text-walnut transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/90 backdrop-blur-md border-b border-sand/30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
              className="hidden sm:inline-flex text-sm font-medium bg-espresso text-linen px-4 py-2 rounded-lg hover:bg-walnut transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* Hero with hex grid background */}
      <section className="relative pt-32 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <HexGrid />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
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

      {/* Angle divider into espresso stats bar */}
      <AngleDivider className="text-espresso" />

      {/* Stats bar — dark espresso */}
      <section className="bg-espresso text-linen">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-3xl sm:text-4xl font-medium">{s.value}</div>
              <div className="text-sm opacity-60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Angle divider out of espresso */}
      <AngleDivider flip className="text-espresso" />

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
                className="group bg-sand/10 border border-sand/30 rounded-xl p-6 hover:border-sand/60 transition-all hover:shadow-lg"
              >
                <div className="text-espresso mb-4">{c.icon}</div>
                <h3 className="font-display font-semibold text-lg text-espresso mb-2">{c.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Angle divider into espresso process */}
      <AngleDivider className="text-espresso" />

      {/* Process — dark section */}
      <section id="process" className="bg-espresso text-linen py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-sm opacity-50 tracking-widest uppercase mb-3">Process</p>
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
                <div className="font-mono text-4xl font-medium opacity-30 mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Angle divider out of espresso */}
      <AngleDivider flip className="text-espresso" />

      {/* Richmond */}
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
                className="bg-sand/10 border border-sand/30 rounded-xl p-6 hover:border-sand/60 transition-colors"
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

      {/* Angle divider into about */}
      <AngleDivider className="text-espresso" />

      {/* About */}
      <section id="about" className="bg-espresso text-linen py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm opacity-50 tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-6">
            Built by urban scientists
          </h2>
          <p className="opacity-70 leading-relaxed max-w-2xl mx-auto mb-4">
            Murmura Labs is an urban intelligence company building tools for cities that
            need to make consequential decisions with confidence. Our platform synthesizes
            8 authoritative data sources into a living model of neighborhood dynamics.
          </p>
          <p className="opacity-70 leading-relaxed max-w-2xl mx-auto">
            Born from{' '}
            <a href="https://aretian.com" target="_blank" rel="noopener" className="underline underline-offset-2 hover:opacity-100 transition-opacity">
              Aretian
            </a>
            's urban analytics research, we combine complexity economics, spatial data science,
            and scenario modeling to help policymakers see the full picture before committing resources.
          </p>
        </div>
      </section>

      {/* Angle divider out of about */}
      <AngleDivider flip className="text-espresso" />

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
