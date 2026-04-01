import { useState, useEffect, useRef, Suspense } from 'react'
import { Menu, X, Users, HeartPulse, Home, Leaf, Footprints, Coins } from 'lucide-react'
import dynamic from 'next/dynamic'

// Register ldrs web component lazily (only used for a small nav animation)
if (typeof window !== 'undefined') {
  import('ldrs').then(({ ping }) => ping.register())
}
const HexNetwork = dynamic(() => import('./HexNetwork'), { ssr: false })
const ContactMap = dynamic(() => import('./ContactMap'), { ssr: false })
import HexGridBackground from './HexGridBackground'
import SplitText from './SplitText'
import HexResolutions2D from './HexResolutions2D'
const Murmuration = dynamic(() => import('./Murmuration'), { ssr: false })
import TypeWriter from './TypeWriter'
import ScrambleValue from './ScrambleValue'
import { CitySection } from './city/CitySection'

const AP7_ROT = Math.atan2(Math.sqrt(3), 5)
function hexPoints(cx: number, cy: number, r: number, rot = 0): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const CAPABILITIES = [
  {
    title: '100+ data fields per cell',
    desc: 'Demographics, health, pollution, housing, transit, amenities, schools, and network metrics across every cell.',
  },
  {
    title: 'Scenario modeling',
    desc: 'Test infrastructure changes, policy shifts, and investment scenarios. See cascading impacts across housing, health, environment, economic, mobility, education, and safety domains.',
  },
  {
    title: 'Equity-first analysis',
    desc: 'Every scenario shows who benefits and who bears the cost \u2014 with displacement risk, equity breakdowns, and ripple effects mapped across the city.',
  },
  {
    title: 'Network intelligence',
    desc: 'Neighborhoods are connected the way real cities work: by commute patterns, shared school districts, pollution corridors, housing markets, and economic ties.',
  },
]

const STATS: { value: string; label: string }[] = []

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
      title: 'Parcel scale',
      scale: '~25 m',
      tags: [
        { label: 'demographics', icon: Users },
        { label: 'health', icon: HeartPulse },
        { label: 'housing', icon: Home },
        { label: 'environment', icon: Leaf },
        { label: 'mobility', icon: Footprints },
        { label: 'economy', icon: Coins },
      ],
      tagStyle: 'text-driftwood/80 bg-driftwood/10',
      desc: '100+ data fields per cell.',
    },
    {
      id: 'aggregate',
      phase: 2,
      dot: 'bg-sand',
      titleColor: 'text-sand',
      title: 'Block scale',
      scale: '~250 m',
      tags: [],
      tagStyle: 'text-sand/80 bg-sand/10',
      desc: 'Aggregate layer. Composite indices summarize conditions across children.',
      json: true,
    },
    {
      id: 'policy',
      phase: 3,
      dot: 'bg-linen',
      titleColor: 'text-linen',
      title: 'Neighborhood scale',
      scale: '~1 km',
      tags: [],
      tagStyle: 'text-linen/70 bg-linen/10',
      desc: (<>Policy agent. Acts <strong className="text-sand/80">on behalf of its residents' interests</strong>, zoning constraints, and neighboring influence.</>),
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
                Three resolutions. One interconnected model.
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
                    minHeight: 120,
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
                    {l.scale && (
                      <span className="font-mono text-[10px] text-driftwood/40 tracking-[0.15em]">
                        {l.scale}
                      </span>
                    )}
                  </div>

                  {/* Tags + desc — only for current phase */}
                  <div
                    className="transition-all duration-700 overflow-hidden pl-4"
                    style={{
                      maxHeight: current ? 300 : 0,
                      opacity: current ? 1 : 0,
                    }}
                  >
                    {'json' in l && l.json ? (
                      <pre className="font-mono text-xs text-sand/60 leading-relaxed bg-linen/5 rounded-lg p-3 mb-3 overflow-hidden max-w-[280px]">
                        <span className="text-sand/30">{'{\n'}</span>
                        {[
                          { key: 'displacement_risk', val: '0.73' },
                          { key: 'health_burden', val: '0.61' },
                          { key: 'connectivity', val: '0.82' },
                        ].map((field) => (
                          <span key={field.key}>
                            {'  '}<span className="text-sand/50">"{field.key}"</span>: <ScrambleValue value={field.val} active={current} speed={35} settleDelay={1800} />,{'\n'}
                          </span>
                        ))}
                        <span className="text-sand/30">{'  ...\n}'}</span>
                      </pre>
                    ) : l.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {l.tags.map((tag) => {
                          const Icon = typeof tag === 'object' ? tag.icon : null
                          const label = typeof tag === 'object' ? tag.label : tag
                          return (
                            <span key={label} className={`font-mono text-xs ${l.tagStyle} px-2 py-0.5 rounded-full inline-flex items-center gap-1`}>
                              {Icon && <Icon size={11} />}
                              {label}
                            </span>
                          )
                        })}
                      </div>
                    ) : null}
                    {l.desc && <p className="text-base text-sand/60 leading-relaxed">{l.desc}</p>}
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

function usePreserveScrollOnResize() {
  const scrollFraction = useRef(0)

  useEffect(() => {
    // Track current fraction on scroll
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) scrollFraction.current = window.scrollY / maxScroll
    }

    const onResize = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        window.scrollTo(0, scrollFraction.current * maxScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}

function useHideOnScroll() {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      // Show when near top (first section) or scrolling up
      setVisible(y < 100 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const navVisible = useHideOnScroll()
  usePreserveScrollOnResize()

  useEffect(() => {
    if (!mobileOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-linen text-walnut">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-espresso focus:text-linen focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      {/* Nav — minimal, floating */}
      <nav
        ref={mobileMenuRef}
        className="fixed top-4 inset-x-4 z-50 bg-linen/60 backdrop-blur-xl rounded-2xl border border-sand/20 transition-transform duration-300 ease-in-out"
        style={{ transform: navVisible ? 'translateY(0)' : 'translateY(calc(-100% - 2rem))' }}
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" aria-label="Murmura Labs home">
            <svg viewBox="-60 -60 120 120" className="w-8 h-8 text-espresso" aria-hidden="true">
              <polygon points={hexPoints(0, 0, 48, -AP7_ROT * 2)} fill="currentColor" stroke="none" opacity="0.08" />
              <polygon points={hexPoints(0, 0, 48 * 0.85, -AP7_ROT)} fill="currentColor" stroke="none" opacity="0.2" />
              <polygon points={hexPoints(0, 0, 48 * 0.85 * 0.85, 0)} fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            </svg>
            <span className="font-display font-bold text-espresso tracking-[0.22em] lowercase text-lg">murmura labs</span>
          </a>

          {/* Desktop nav */}
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
              href="https://murmur.murmuralabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-espresso text-linen px-5 py-2.5 rounded-full hover:bg-walnut transition-colors duration-300 inline-flex items-center gap-2"
            >
              {/* @ts-ignore */}
              <l-ping size="14" speed="2" color="#FAF0E6" />
              Open murmur
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl text-driftwood hover:text-espresso hover:bg-sand/20 transition-colors duration-200"
            aria-label="Navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="sm:hidden border-t border-sand/20 px-6 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-sm text-driftwood hover:text-espresso py-2.5 transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://murmur.murmuralabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm font-medium bg-espresso text-linen px-5 py-2.5 rounded-full hover:bg-walnut transition-colors duration-300 inline-flex items-center justify-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              {/* @ts-ignore */}
              <l-ping size="14" speed="2" color="#FAF0E6" />
              Open murmur
            </a>
          </div>
        )}
      </nav>

      <main id="main-content">
      {/* Hero — full viewport, cinematic */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <HexGridBackground delay={500} />
        <div className="text-center max-w-5xl mx-auto animate-fade-in relative z-10">
          <p className="font-display font-bold text-sm text-driftwood tracking-[0.22em] lowercase mb-6">
            murmura labs presents
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-espresso lowercase leading-none mb-4 tracking-[0.22em]">
            murmur
            <span className="sr-only"> — urban foresight platform by Murmura Labs</span>
          </h1>
          <p className="text-lg sm:text-xl tracking-[0.15em] uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
            <TypeWriter text="urban foresight platform" speed={60} delay={800} className="text-driftwood" />
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              v0.1
            </span>
            <span className="font-mono text-xs text-driftwood/50">April 2026</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-sand/60" />
        </div>
      </section>

      {/* What is murmur — full dark manifesto section like lila.ai */}
      <section className="py-32 px-8 bg-espresso text-linen relative overflow-hidden">
        <Suspense fallback={null}><HexNetwork className="opacity-25" dark /></Suspense>
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sand inline-block" />
            What is murmur?
          </p>

          <div className="mb-10 max-w-4xl">
            <SplitText
              text="agent based simulations"
              className="font-bold text-4xl sm:text-5xl lg:text-6xl text-linen leading-[1.15]"
              tag="h2"
              splitType="words"
              delay={80}
              duration={800}
              from={{ opacity: 0, transform: 'translateY(50px)' }}
              to={{ opacity: 1, transform: 'translateY(0)' }}
            />
            {' '}
            <SplitText
              text="at the urban scale."
              className="font-bold text-4xl sm:text-5xl lg:text-6xl text-sand leading-[1.15]"
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

        </div>
      </section>

      {/* Hex resolutions — scrolling reveal */}
      <HexScrollSection stats={STATS} />

      {/* Platform — city viz + description */}
      <section id="platform" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">
            {/* Text — 2/5 width */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">Platform</p>
              <h2 className="font-bold text-3xl sm:text-4xl text-espresso mb-6 leading-tight">
                A living model
                <br />of every neighborhood
              </h2>
              <p className="text-lg text-driftwood leading-relaxed">
                murmur divides your city into hex cells, each carrying 100+ real-world
                data fields. Apply a scenario &mdash; a new bike lane, a transit line,
                a rezoning &mdash; and see cascading impacts across every neighborhood.
              </p>
            </div>

            {/* City visualization — 3/5 width */}
            <div className="lg:col-span-3">
              <CitySection className="w-full aspect-square rounded-2xl" />
            </div>
          </div>

          {/* Capability cards */}
          <div className="grid sm:grid-cols-2 gap-px bg-sand/20 rounded-2xl overflow-hidden">
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="bg-linen p-10 hover:bg-[#f5d9be]/30 transition-all duration-500 group"
              >
                <h3 className="font-semibold text-xl text-espresso mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {c.title}
                </h3>
                <p className="text-sm text-driftwood leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Fork a scenario — collaborative branching */}
      <section className="py-48 px-8 bg-espresso text-linen">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-4">Collaborate</p>
            <h2 className="font-bold text-4xl sm:text-5xl text-linen leading-tight mb-8">
              Fork a scenario.
              <br />Compare futures.
            </h2>
            <p className="text-base text-sand leading-relaxed mb-6">
              Every team starts from the same living baseline &mdash; a shared, always-current
              model of your city. When you want to test an idea, fork a scenario and
              explore it independently.
            </p>
            <p className="text-base text-sand leading-relaxed">
              Compare branches side by side. Merge the best outcomes back. City planning
              as version control.
            </p>
          </div>
          {/* Right — branch visual */}
          <div className="flex justify-center">
            <svg viewBox="0 0 280 320" className="w-full max-w-xs" fill="none" role="img" aria-label="Diagram showing scenario branching: a baseline trunk forks into scenario A and scenario B">
              {/* Main trunk */}
              <line x1="140" y1="20" x2="140" y2="300" stroke="#c6a181" strokeWidth="2" />
              {/* Fork point A — earlier */}
              <circle cx="140" cy="90" r="5" fill="#c6a181" />
              {/* Branch left from fork A */}
              <path d="M140 90 C140 140, 75 120, 75 180" stroke="#c6a181" strokeWidth="2" fill="none" />
              <circle cx="75" cy="180" r="3" fill="#c6a181" opacity="0.6" />
              <line x1="75" y1="180" x2="75" y2="280" stroke="#c6a181" strokeWidth="2" opacity="0.6" />
              <circle cx="75" cy="230" r="3" fill="#c6a181" opacity="0.3" />
              <circle cx="75" cy="280" r="4" fill="#c6a181" opacity="0.6" />
              {/* Fork point B — later */}
              <circle cx="140" cy="170" r="5" fill="#c6a181" />
              {/* Branch right from fork B */}
              <path d="M140 170 C140 220, 210 200, 210 250" stroke="#c6a181" strokeWidth="2" fill="none" />
              <circle cx="210" cy="250" r="3" fill="#c6a181" opacity="0.6" />
              <line x1="210" y1="250" x2="210" y2="280" stroke="#c6a181" strokeWidth="2" opacity="0.6" />
              <circle cx="210" cy="280" r="4" fill="#c6a181" opacity="0.6" />
              {/* Main end */}
              <circle cx="140" cy="300" r="4" fill="#c6a181" />
              {/* Labels */}
              <text x="140" y="14" textAnchor="middle" className="font-mono" fill="#c6a181" fontSize="9" opacity="0.5">baseline</text>
              <text x="75" y="296" textAnchor="middle" className="font-mono" fill="#c6a181" fontSize="9" opacity="0.5">scenario A</text>
              <text x="210" y="296" textAnchor="middle" className="font-mono" fill="#c6a181" fontSize="9" opacity="0.5">scenario B</text>
              <text x="140" y="316" textAnchor="middle" className="font-mono" fill="#c6a181" fontSize="9" opacity="0.5">main</text>
              {/* Commit dot on trunk */}
              <circle cx="140" cy="50" r="3" fill="#c6a181" opacity="0.4" />
              <circle cx="140" cy="130" r="3" fill="#c6a181" opacity="0.4" />
              <circle cx="140" cy="230" r="3" fill="#c6a181" opacity="0.4" />
              <circle cx="140" cy="265" r="3" fill="#c6a181" opacity="0.4" />
            </svg>
          </div>
        </div>
      </section>


      {/* About */}
      <section id="about" className="py-48 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">About</p>
          <h2 className="font-bold text-4xl sm:text-5xl text-espresso mb-8 leading-tight">
            Built by urban scientists
          </h2>
          <p className="text-lg text-driftwood leading-relaxed max-w-2xl mx-auto mb-6">
            Murmura Labs builds decision tools for cities — powered by the latest in
            agent-based modeling, spatial data science, and generative AI.
          </p>
          <p className="text-lg text-driftwood leading-relaxed max-w-2xl mx-auto">
            Founded in the complexity economics tradition of the Santa Fe Institute{' '}
            <a href="https://www.science.org/doi/10.1126/science.adq1055" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-sand/60 hover:text-espresso transition-colors">[1]</a>{' '}
            <a href="https://www.nature.com/articles/s42254-019-0063-3" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-sand/60 hover:text-espresso transition-colors">[2]</a>{' '}
            <a href="https://arxiv.org/abs/2301.07358" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-sand/60 hover:text-espresso transition-colors">[3]</a>,
            Murmura Labs applies agent-based modeling and spatial data science to the built environment,
            making the downstream consequences of urban decisions visible before they unfold.
          </p>
        </div>
      </section>

      {/* Contact — two-column with map */}
      <section id="contact" className="py-48 px-8 bg-espresso text-linen">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 gap-16 items-center">
          {/* Left — map */}
          <div className="h-[400px] sm:h-[500px] order-2 sm:order-1">
            <Suspense fallback={<div className="w-full h-full rounded-2xl bg-espresso/50 border border-linen/10" />}>
              <ContactMap />
            </Suspense>
          </div>
          {/* Right — text */}
          <div className="order-1 sm:order-2">
            <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-4">Contact</p>
            <h2 className="font-bold text-4xl sm:text-5xl text-linen mb-8 leading-tight">
              Let's model your city
            </h2>
            <p className="text-lg text-sand leading-relaxed mb-12">
              Based in San Francisco and working with cities across the Bay Area and beyond. Find out how murmur can help your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="mailto:hello@murmuralabs.com"
                className="group inline-flex items-center justify-center bg-linen text-espresso px-8 py-3 rounded-full font-medium hover:bg-sand transition-all duration-300 text-base"
              >
                hello@murmuralabs.com
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="https://murmur.murmuralabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-linen/40 text-linen px-8 py-3 rounded-full font-medium hover:bg-linen/10 transition-all duration-300 text-base"
              >
                Try murmur
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Murmuration definition */}
      <section className="py-48 px-8 sm:px-16 lg:px-24 bg-linen relative overflow-hidden">
        {/* Boid canvas on right half */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden sm:block">
          <Suspense fallback={null}>
            <Murmuration />
          </Suspense>
        </div>
        <div className="relative z-10">
          <div className="max-w-lg">
            <p className="font-mono text-sm text-driftwood/60 tracking-[0.2em] uppercase mb-3">mur·mu·ra·tion</p>
            <p className="font-mono text-xs text-driftwood/40 mb-10">/ˌmərmyəˈrāSH(ə)n/</p>
            <p className="text-xl sm:text-2xl text-driftwood leading-relaxed font-light italic">
              The phenomenon in which many individual agents, each following simple local
              rules, produce coherent, system-wide behavior without central direction.
            </p>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-sand/20 py-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <HexResolutions2D visibleLayers={3} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <svg viewBox="-60 -60 120 120" className="w-7 h-7 text-espresso" aria-hidden="true">
              <polygon points={hexPoints(0, 0, 48, -AP7_ROT * 2)} fill="currentColor" stroke="none" opacity="0.08" />
              <polygon points={hexPoints(0, 0, 48 * 0.85, -AP7_ROT)} fill="currentColor" stroke="none" opacity="0.2" />
              <polygon points={hexPoints(0, 0, 48 * 0.85 * 0.85, 0)} fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            </svg>
            <span className="font-display font-bold text-espresso tracking-[0.22em] lowercase">murmura labs</span>
          </div>
          <p className="text-sm text-driftwood">
            &copy; {new Date().getFullYear()} Murmura Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
