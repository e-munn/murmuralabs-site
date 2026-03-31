import { useState, useEffect, useRef } from 'react'
import './index.css'
import HexNetwork from './HexNetwork'
import SplitText from './SplitText'
import HexResolutions2D from './HexResolutions2D'

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Richmond', href: '#richmond' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const CAPABILITIES = [
  {
    title: '100+ data fields per cell',
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

const STATS = [
  { value: '4,655', label: 'cells' },
  { value: '100+', label: 'data fields per cell' },
  { value: '8', label: 'real data sources' },
  { value: '7', label: 'impact domains' },
]

function HexScrollSection({ stats }: { stats: { value: string; label: string }[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setProgress(Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight))))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth phase: 0=intro, 1=data, 2=aggregate, 3=policy
  const phase = progress < 0.12 ? 0 : progress < 0.37 ? 1 : progress < 0.62 ? 2 : 3

  // SVG layers: intro=all, then build up from data
  const visibleLayers = phase === 0 ? 1 : phase === 1 ? 3 : phase === 2 ? 2 : 1

  const layers = [
    {
      id: 'data',
      phase: 1,
      dot: 'bg-driftwood',
      titleColor: 'text-driftwood',
      title: 'Data layer',
      tags: ['income', 'age', 'race', 'PM2.5', 'asthma', 'rent',
        'transit stops', 'walkability', 'schools', 'food access',
        'commute mode', 'home value', 'pollution burden'],
      tagStyle: 'text-driftwood/80 bg-driftwood/10',
      desc: '100+ observed fields per cell. No synthetic data, no imputation.',
    },
    {
      id: 'aggregate',
      phase: 2,
      dot: 'bg-sand',
      titleColor: 'text-sand',
      title: 'Aggregate layer',
      tags: ['displacement pressure', 'health composite', 'pollution corridor',
        'transit access score', 'housing affordability', 'vulnerability index',
        'economic connectivity', 'school quality'],
      tagStyle: 'text-sand/80 bg-sand/10',
      desc: 'Raw signals composed into neighborhood-level indicators.',
    },
    {
      id: 'policy',
      phase: 3,
      dot: 'bg-linen',
      titleColor: 'text-linen',
      title: 'Policy agent',
      tags: ['land use', 'zoning', 'residents', 'renters vs owners',
        'local economy', 'infrastructure capacity', 'political context'],
      tagStyle: 'text-linen/70 bg-linen/10',
      desc: 'Each cell acts as an agent — with residents, competing interests, and zoning. It responds to interventions the way a neighborhood actually would.',
    },
  ]

  return (
    <section ref={sectionRef} className="bg-espresso relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-3 gap-8 items-center">
          {/* Left 2/3: hex */}
          <div className="col-span-2 aspect-square relative">
            <HexResolutions2D visibleLayers={visibleLayers} />
          </div>

          {/* Right 1/3: stacking layers */}
          <div className="flex flex-col gap-8 overflow-hidden">
            {/* Intro */}
            <div className={`transition-all duration-700 ${phase === 0 ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
              <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-3">Multi-resolution model</p>
              <p className="text-base text-sand leading-relaxed">
                Three interlocking scales — data flows up, decisions flow down.
              </p>
            </div>

            {/* Layer sections — accumulate, only current shows desc */}
            {layers.map((l) => {
              const visible = phase >= l.phase
              const current = phase === l.phase
              return (
                <div
                  key={l.id}
                  className="transition-all duration-700"
                  style={{
                    opacity: visible ? 1 : 0,
                    maxHeight: visible ? 400 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Title — always visible once shown */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${l.dot}`} />
                    <span className={`font-mono text-xs ${l.titleColor} tracking-[0.2em] uppercase`}>
                      {l.title}
                    </span>
                  </div>

                  {/* Tags + desc — only for current phase */}
                  <div
                    className="transition-all duration-700 overflow-hidden"
                    style={{
                      maxHeight: current ? 300 : 0,
                      opacity: current ? 1 : 0,
                    }}
                  >
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {l.tags.map((tag) => (
                        <span key={tag} className={`font-mono text-xs ${l.tagStyle} px-2 py-0.5 rounded-full`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-sand/60 leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              )
            })}

            {/* Stats — appear with policy */}
            <div
              className="transition-all duration-700 overflow-hidden"
              style={{
                opacity: phase === 3 ? 1 : 0,
                maxHeight: phase === 3 ? 200 : 0,
              }}
            >
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-sand/20">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-xl font-medium text-linen tracking-tight">{s.value}</div>
                    <div className="text-xs text-sand mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-walnut">
      {/* Nav — minimal, floating */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-linen/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-espresso tracking-[0.22em] lowercase text-lg">
            murmura labs
          </a>
          <div className="hidden sm:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-driftwood hover:text-espresso transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm font-medium bg-espresso text-linen px-5 py-2.5 rounded-full hover:bg-walnut transition-colors duration-300"
            >
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* Hero — full viewport, cinematic */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <HexNetwork className="opacity-40" />
        <div className="text-center max-w-5xl mx-auto animate-fade-in relative z-10">
          <p className="font-mono text-sm text-driftwood tracking-[0.3em] uppercase mb-8">
            murmura labs presents
          </p>
          <h1 className="font-display font-bold text-7xl sm:text-8xl lg:text-9xl text-espresso leading-[0.95] mb-8 tracking-tight">
            murmur
          </h1>
          <p className="text-xl sm:text-2xl text-driftwood max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            See the second-order effects of urban decisions
            before they're made.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center bg-espresso text-linen px-10 py-4 rounded-full font-medium hover:bg-walnut transition-all duration-300"
            >
              Request a demo
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="#platform"
              className="inline-flex items-center justify-center border border-sand/60 text-walnut px-10 py-4 rounded-full font-medium hover:bg-espresso/5 transition-all duration-300"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-sand/60" />
        </div>
      </section>

      {/* What is murmur — full dark manifesto section like lila.ai */}
      <section className="min-h-screen flex items-center px-8 bg-espresso text-linen relative overflow-hidden">
        <HexNetwork className="opacity-25" dark />
        <div className="max-w-7xl mx-auto py-32 relative z-10">
          <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sand inline-block" />
            What is murmur?
          </p>

          <div className="mb-10 max-w-4xl">
            <SplitText
              text="murmur is building"
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-linen leading-[1.15]"
              tag="h2"
              splitType="words"
              delay={80}
              duration={800}
              from={{ opacity: 0, transform: 'translateY(50px)' }}
              to={{ opacity: 1, transform: 'translateY(0)' }}
            />
            {' '}
            <SplitText
              text="Urban Foresight."
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-sand leading-[1.15]"
              tag="span"
              splitType="words"
              delay={80}
              duration={800}
              from={{ opacity: 0, transform: 'translateY(50px)' }}
              to={{ opacity: 1, transform: 'translateY(0)' }}
            />
          </div>

          <div className="max-w-4xl mb-10">
            <SplitText
              text="With real data and network science, murmur models cascading impacts of urban decisions across demographics, health, environment, and equity."
              className="text-2xl sm:text-3xl lg:text-4xl text-linen/90 leading-[1.3] font-light"
              tag="p"
              splitType="words"
              delay={40}
              duration={700}
              from={{ opacity: 0, transform: 'translateY(30px)' }}
              to={{ opacity: 1, transform: 'translateY(0)' }}
            />
          </div>

          <div className="max-w-4xl">
            <SplitText
              text="See the full picture before committing resources."
              className="text-2xl sm:text-3xl lg:text-4xl text-linen/90 font-light leading-[1.3]"
              tag="p"
              splitType="words"
              delay={40}
              duration={700}
              from={{ opacity: 0, transform: 'translateY(30px)' }}
              to={{ opacity: 1, transform: 'translateY(0)' }}
            />
          </div>
        </div>
      </section>

      {/* Hex resolutions — scrolling reveal */}
      <HexScrollSection stats={STATS} />

      {/* Platform — generous whitespace, left-aligned intro */}
      <section id="platform" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">Platform</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-espresso mb-6 leading-tight">
              A digital twin for
              <br />every neighborhood
            </h2>
            <p className="text-lg text-driftwood leading-relaxed">
              murmur divides a city into cells. Each cell carries 100+ real-world
              data fields from 8 authoritative sources. Apply a scenario — a new bike lane, a transit line,
              a rezoning — and the system computes cascading impacts across every cell.
            </p>
          </div>

          {/* Capability cards — hover zoom like lila */}
          <div className="grid sm:grid-cols-2 gap-px bg-sand/20 rounded-2xl overflow-hidden">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="bg-linen p-10 hover:bg-[#f5d9be]/30 transition-all duration-500 group"
              >
                <h3 className="font-display font-semibold text-xl text-espresso mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {c.title}
                </h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Separator line */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="h-px bg-sand/20" />
      </div>

      {/* How it works — numbered steps, wide layout */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">Process</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-espresso leading-tight">
              From scenario to insight
              <br />in seconds
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-16">
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
              <div key={item.step} className="group">
                <div className="font-mono text-6xl font-medium text-sand/40 mb-6 group-hover:text-sand transition-colors duration-500">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg text-espresso mb-3">{item.title}</h3>
                <p className="text-sm text-driftwood leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Richmond case study — dark inverted section */}
      <section id="richmond" className="py-32 px-8 bg-espresso text-linen relative overflow-hidden">
        <HexNetwork className="opacity-15" dark />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-4">Case Study</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-linen mb-6 leading-tight">
              Richmond, California
            </h2>
            <p className="text-lg text-sand leading-relaxed mb-6">
              Our first city model covers Richmond's 130,000 residents across 4,655 cells.
              Richmond faces a historic moment: a $550M Chevron settlement, $9.56M in federal
              Reconnecting Communities funding, and the Hilltop Horizon redevelopment of 5,000-7,500 new units.
            </p>
            <p className="text-lg text-sand leading-relaxed">
              murmur can model how each of these investments propagates through the city —
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
                className="border border-sand/20 rounded-2xl p-8 hover:border-sand/40 transition-all duration-300 group"
              >
                <p className="text-sm text-linen/90 font-medium leading-relaxed mb-6 group-hover:text-linen transition-colors duration-300">
                  "{item.q}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((d) => (
                    <span key={d} className="font-mono text-xs text-sand/80 bg-sand/10 px-3 py-1 rounded-full">
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
      <section id="about" className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">About</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-espresso mb-8 leading-tight">
            Built by urban scientists
          </h2>
          <p className="text-lg text-driftwood leading-relaxed max-w-2xl mx-auto mb-6">
            Murmura Labs is an urban intelligence company building tools for cities that
            need to make consequential decisions with confidence. Our platform synthesizes
            8 authoritative data sources into a living model of neighborhood dynamics.
          </p>
          <p className="text-lg text-driftwood leading-relaxed max-w-2xl mx-auto">
            Born from{' '}
            <a
              href="https://aretian.com"
              target="_blank"
              rel="noopener"
              className="text-espresso underline underline-offset-4 decoration-sand hover:decoration-espresso transition-colors duration-300"
            >
              Aretian
            </a>
            's urban analytics research, we combine complexity economics, spatial data science,
            and scenario modeling to help policymakers see the full picture before committing resources.
          </p>
        </div>
      </section>

      {/* Contact — clean, centered */}
      <section id="contact" className="py-32 px-8 bg-[#f5d9be]/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">Contact</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-espresso mb-8 leading-tight">
            Let's model your city
          </h2>
          <p className="text-lg text-driftwood leading-relaxed mb-12">
            We're working with cities in the Bay Area and beyond. If you're a policymaker,
            urban planner, or community leader facing a consequential decision, we'd love
            to show you what murmur can reveal.
          </p>
          <a
            href="mailto:hello@murmuralabs.com"
            className="group inline-flex items-center justify-center bg-espresso text-linen px-10 py-4 rounded-full font-medium hover:bg-walnut transition-all duration-300 text-lg"
          >
            hello@murmuralabs.com
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand/20 py-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <HexResolutions2D visibleLayers={3} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="font-display font-bold text-espresso tracking-[0.22em] lowercase">
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
