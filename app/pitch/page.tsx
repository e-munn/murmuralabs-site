'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import HexResolutions2D from '@/HexResolutions2D'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  HeartPulse,
  Home,
  Leaf,
  Footprints,
  Coins,
  GraduationCap,
  Shield,
  GitBranch,
  GitMerge,
  Scale,
  Network,
  Hexagon,
  Layers,
  FlaskConical,
  TrendingUp,
  Mail,
  ExternalLink,
  Microscope,
  Building2,
  Globe,
  Zap,
  Target,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react'

/* ─── Hex Logo (inline SVG from logo-dark.svg, adapted for slides) ─── */
function HexLogo({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-60 -60 120 120"
      width={size}
      height={size}
      className={className}
    >
      <polygon
        points="17.82,-44.57 47.51,-6.86 29.69,37.71 -17.82,44.57 -47.51,6.86 -29.69,-37.71"
        fill="#c6a181"
        opacity="0.08"
      />
      <polygon
        points="26.71,-30.84 40.06,7.71 13.35,38.55 -26.71,30.84 -40.06,-7.71 -13.35,-38.55"
        fill="#c6a181"
        opacity="0.2"
      />
      <polygon
        points="30.03,-17.34 30.03,17.34 0.00,34.68 -30.03,17.34 -30.03,-17.34 -0.00,-34.68"
        fill="#c6a181"
        stroke="#c6a181"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  )
}

/* ─── Decorative hex grid background for dark slides ─── */
function HexPattern({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="hex-pat" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
            fill="none"
            stroke="#c6a181"
            strokeWidth="0.5"
          />
          <path
            d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
            fill="none"
            stroke="#c6a181"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-pat)" />
    </svg>
  )
}

/* ─── Git branch diagram (matches the main site's version) ─── */
function GitDiagram() {
  return (
    <svg viewBox="0 0 280 320" className="w-full max-w-xs mx-auto" fill="none" role="img" aria-label="Scenario branching diagram">
      {/* Main trunk */}
      <line x1="140" y1="20" x2="140" y2="300" stroke="#c6a181" strokeWidth="2" />
      {/* Fork point A */}
      <circle cx="140" cy="90" r="5" fill="#c6a181" />
      {/* Branch left */}
      <path d="M140 90 C140 140, 75 120, 75 180" stroke="#c6a181" strokeWidth="2" fill="none" />
      <circle cx="75" cy="180" r="3" fill="#c6a181" opacity="0.6" />
      <line x1="75" y1="180" x2="75" y2="280" stroke="#c6a181" strokeWidth="2" opacity="0.6" />
      <circle cx="75" cy="230" r="3" fill="#c6a181" opacity="0.3" />
      <circle cx="75" cy="280" r="4" fill="#c6a181" opacity="0.6" />
      {/* Fork point B */}
      <circle cx="140" cy="170" r="5" fill="#c6a181" />
      {/* Branch right */}
      <path d="M140 170 C140 220, 210 200, 210 250" stroke="#c6a181" strokeWidth="2" fill="none" />
      <circle cx="210" cy="250" r="3" fill="#c6a181" opacity="0.6" />
      <line x1="210" y1="250" x2="210" y2="280" stroke="#c6a181" strokeWidth="2" opacity="0.6" />
      <circle cx="210" cy="280" r="4" fill="#c6a181" opacity="0.6" />
      {/* Main end */}
      <circle cx="140" cy="300" r="4" fill="#c6a181" />
      {/* Labels */}
      <text x="140" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fill="#c6a181" fontSize="9" opacity="0.5">baseline</text>
      <text x="75" y="296" textAnchor="middle" fontFamily="JetBrains Mono" fill="#c6a181" fontSize="9" opacity="0.5">scenario A</text>
      <text x="210" y="296" textAnchor="middle" fontFamily="JetBrains Mono" fill="#c6a181" fontSize="9" opacity="0.5">scenario B</text>
      <text x="140" y="316" textAnchor="middle" fontFamily="JetBrains Mono" fill="#c6a181" fontSize="9" opacity="0.5">main</text>
      {/* Commit dots on trunk */}
      <circle cx="140" cy="50" r="3" fill="#c6a181" opacity="0.4" />
      <circle cx="140" cy="130" r="3" fill="#c6a181" opacity="0.4" />
      <circle cx="140" cy="230" r="3" fill="#c6a181" opacity="0.4" />
      <circle cx="140" cy="265" r="3" fill="#c6a181" opacity="0.4" />
    </svg>
  )
}


/* ─── Icon badge component ─── */
function IconBadge({ children, color = 'sand' }: { children: React.ReactNode; color?: string }) {
  const bgMap: Record<string, string> = {
    sand: 'bg-sand/15',
    canopy: 'bg-canopy/15',
    ember: 'bg-ember/15',
    sky: 'bg-sky/15',
  }
  const textMap: Record<string, string> = {
    sand: 'text-sand',
    canopy: 'text-canopy',
    ember: 'text-ember',
    sky: 'text-sky',
  }
  return (
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgMap[color]} ${textMap[color]}`}>
      {children}
    </div>
  )
}

/* ─── Stat block ─── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-display font-bold text-sand">{value}</div>
      <div className="text-sm text-sand/60 mt-1">{label}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SLIDE DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════ */

type SlideTheme = 'dark' | 'light'

interface SlideConfig {
  theme: SlideTheme
  content: React.ReactNode
}

/* ─── Personalized intros keyed by first name (lowercase) ─── */
const INTROS: Record<string, { greeting: string; message: string }> = {
  kyle: {
    greeting: 'Hey Kyle',
    message: "Working in the space of Urban Planning Software, I've collected my best ideas and this is how they've come together. Let me know any first impressions. Am free anytime to chat.",
  },
  holden: {
    greeting: 'sup dawg',
    message: 'This is how I would solve the whole help-municipalities thing. Let me know any first impressions, any cringe spots.',
  },
  timi: {
    greeting: 'Hey Timi',
    message: "Here's something I'm working on. Let me know any first impressions. Any spots of cringe?",
  },
  lance: {
    greeting: 'Greetings Father',
    message: "Here's how I would propose to address the want for city digital twins. Let me know what you think. A lot is based on J. Doyne Farmer's work (economic complexity researcher) and sprinkling AI on top of it.",
  },
  josh: {
    greeting: 'Hey Josh',
    message: "Hope you're not sick. Here's the approach. Looking for first impressions. Whether the vision is clear, any spots of cringe.",
  },
}

const slides: SlideConfig[] = [
  /* ── 1. Title ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6">
        <HexLogo size={100} />
        <h1 className="font-display font-bold text-5xl sm:text-7xl tracking-[0.22em] text-linen lowercase">
          murmur
        </h1>
        <p className="text-xl sm:text-2xl text-sand/80 tracking-[0.3em] uppercase font-display">
          urban foresight platform
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canopy/15 text-canopy text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-canopy animate-pulse" />
            v0.1
          </span>
          <span className="text-sand/40 text-sm font-mono">April 2026</span>
        </div>
      </div>
    ),
  },

  /* ── 2. Murmuration Definition ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto gap-8">
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          mur&middot;mu&middot;ra&middot;tion
        </h2>
        <p className="text-sand/40 font-mono text-sm">/&#716;m&#601;rmy&#601;&#712;r&#257;SH(&#601;)n/</p>
        <p className="text-sand/70 text-lg leading-relaxed max-w-xl italic">
          &#34;The phenomenon in which many individual agents, each following simple local rules,
          produce coherent, system-wide behavior without central direction.&#34;
        </p>
        <p className="text-sand/50 text-sm max-w-md">
          Like starlings in flight, urban systems emerge from millions of individual decisions.
          murmur models this emergence.
        </p>
      </div>
    ),
  },

  /* ── 3. The Problem ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">The Problem</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          Cities make decisions<br />
          <span className="text-ember">blind to cascading effects</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-4">
          {[
            { icon: <Building2 size={20} />, text: 'A new development displaces residents. Where do they go?' },
            { icon: <Footprints size={20} />, text: 'A transit cut changes commutes. How does health shift?' },
            { icon: <Leaf size={20} />, text: 'A zoning change alters pollution. Who bears the cost?' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-walnut/40">
              <div className="text-ember">{item.icon}</div>
              <p className="text-sand/80 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 3. Second-Order Effects ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">The Insight</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          Every urban decision has<br />
          <span className="text-sand">second-order effects</span>
        </h2>
        <div className="flex flex-col gap-3">
          {[
            { order: '1st', text: 'New housing built in neighborhood', color: 'text-canopy' },
            { order: '2nd', text: 'Rents rise, long-time residents displaced', color: 'text-ember' },
            { order: '3rd', text: 'Displaced families lose access to schools, transit, jobs', color: 'text-danger' },
            { order: '4th', text: 'Health outcomes worsen, economic mobility drops', color: 'text-danger' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-walnut/30">
              <span className={`font-mono text-sm ${item.color} shrink-0 w-8`}>{item.order}</span>
              <span className="text-sand/80 text-sm">{item.text}</span>
              {i < 3 && <span className="text-sand/20 ml-auto">↓</span>}
            </div>
          ))}
        </div>
        <p className="text-sand/50 text-sm">
          Traditional planning tools see the 1st order. murmur models all of them.
        </p>
      </div>
    ),
  },

  /* ── 4. The Vision ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">The Vision</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          What if you could <span className="text-canopy">see the future</span><br />
          of every urban decision?
        </h2>
        <p className="text-sand/70 text-lg max-w-xl leading-relaxed">
          Before breaking ground. Before passing policy. Before allocating a dollar.
          See how a decision ripples across demographics, health, environment, and equity.
        </p>
      </div>
    ),
  },

  /* ── 5. What is murmur? ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">The Product</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          Agent-based simulation<br />
          <span className="text-sand">at the urban scale</span>
        </h2>
        <p className="text-sand/70 text-lg leading-relaxed">
          With real data and network science, murmur models cascading impacts of urban
          decisions across demographics, health, environment, and equity.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          {['Agent-Based Modeling', 'Spatial Data Science', 'Network Science', 'Generative AI'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full border border-sand/20 text-sand/70 text-sm font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 6. How It Works ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">How It Works</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-espresso leading-tight">
          Real data in. Simulated futures out.
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Ingest',
              desc: 'Census, health, transit, housing, pollution, schools, amenities — 100+ fields per hex cell',
              icon: <Layers size={20} />,
            },
            {
              step: '02',
              title: 'Simulate',
              desc: 'Agents respond to changes. Impacts cascade across connected neighborhoods via real networks',
              icon: <Zap size={20} />,
            },
            {
              step: '03',
              title: 'Compare',
              desc: 'Fork scenarios, run variations, compare outcomes side-by-side. Merge the best future',
              icon: <GitMerge size={20} />,
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-driftwood/40 font-mono text-sm">{item.step}</span>
                <div className="text-driftwood">{item.icon}</div>
              </div>
              <h3 className="font-display font-bold text-xl text-espresso">{item.title}</h3>
              <p className="text-driftwood/80 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 7. Multi-Resolution Model ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col lg:flex-row items-center justify-center h-full max-w-4xl mx-auto gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">Core Innovation</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight">
            Three resolutions.<br />
            One interconnected model.
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { scale: '~25m', label: 'Parcel', color: 'text-canopy', desc: '100+ data fields per cell' },
              { scale: '~250m', label: 'Block', color: 'text-ember', desc: 'Composite indices & risk scores' },
              { scale: '~1km', label: 'Neighborhood', color: 'text-sky', desc: 'Policy agents & zoning constraints' },
            ].map((item) => (
              <div key={item.scale} className="flex items-center gap-4">
                <span className={`font-mono text-sm ${item.color} w-12`}>{item.scale}</span>
                <div>
                  <span className="font-display font-bold text-espresso">{item.label}</span>
                  <span className="text-driftwood/60 text-sm ml-2">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative w-full" style={{ minHeight: 240, maxHeight: '50vh' }}>
          <HexResolutions2D
            showAll
            svgScale={1}
            colors={{ parcel: '#16a34a', block: '#ea580c', neighborhood: '#0284c7' }}
          />
        </div>
      </div>
    ),
  },

  /* ── 8. Parcel Scale ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <div className="flex items-center gap-3">
          <IconBadge color="canopy"><Hexagon size={20} /></IconBadge>
          <p className="text-canopy uppercase tracking-[0.2em] text-sm font-mono">Parcel Scale · ~25m</p>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-linen leading-tight">
          100+ data fields per cell
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: <Users size={18} />, label: 'Demographics', color: 'canopy' },
            { icon: <HeartPulse size={18} />, label: 'Health', color: 'canopy' },
            { icon: <Home size={18} />, label: 'Housing', color: 'canopy' },
            { icon: <Leaf size={18} />, label: 'Environment', color: 'canopy' },
            { icon: <Footprints size={18} />, label: 'Mobility', color: 'canopy' },
            { icon: <Coins size={18} />, label: 'Economy', color: 'canopy' },
            { icon: <GraduationCap size={18} />, label: 'Education', color: 'canopy' },
            { icon: <Shield size={18} />, label: 'Safety', color: 'canopy' },
            { icon: <MapPin size={18} />, label: 'Amenities', color: 'canopy' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-walnut/40">
              <span className="text-canopy">{item.icon}</span>
              <span className="text-sand/80 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 9. Block Scale ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <div className="flex items-center gap-3">
          <IconBadge color="ember"><Layers size={20} /></IconBadge>
          <p className="text-ember uppercase tracking-[0.2em] text-sm font-mono">Block Scale · ~250m</p>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-linen leading-tight">
          An aggregate layer built from<br />dozens of analyses
        </h2>
        <div className="bg-walnut/40 rounded-xl p-6 font-mono text-sm">
          <div className="text-sand/40 mb-3">{'// block-level composite'}</div>
          {[
            { key: 'displacement_risk', value: '0.72', color: 'text-ember' },
            { key: 'health_burden', value: '0.58', color: 'text-ember' },
            { key: 'transit_access', value: '0.41', color: 'text-danger' },
            { key: 'green_coverage', value: '0.33', color: 'text-danger' },
            { key: 'economic_mobility', value: '0.64', color: 'text-ember' },
            { key: 'school_quality', value: '0.79', color: 'text-canopy' },
          ].map((item) => (
            <div key={item.key} className="flex justify-between py-1.5 border-b border-sand/10 last:border-0">
              <span className="text-sand/70">{item.key}</span>
              <span className={item.color}>{item.value}</span>
            </div>
          ))}
        </div>
        <p className="text-sand/50 text-sm">
          Each composite metric is the result of multiple spatial, demographic, and network analyses aggregated from parcel-level data.
        </p>
      </div>
    ),
  },

  /* ── 10. Neighborhood Scale ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <div className="flex items-center gap-3">
          <IconBadge color="sky"><Network size={20} /></IconBadge>
          <p className="text-sky uppercase tracking-[0.2em] text-sm font-mono">Neighborhood Scale · ~1km</p>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-linen leading-tight">
          Policy agents acting on<br />
          residents&#39; interests
        </h2>
        <p className="text-sand/70 text-lg leading-relaxed">
          At the neighborhood scale, autonomous agents represent community interests — advocating
          for residents within zoning constraints, budget limits, and equity targets.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            'Zoning & land-use constraints',
            'Budget allocation optimization',
            'Equity-weighted prioritization',
            'Cross-neighborhood spillover modeling',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 p-3 rounded-lg bg-walnut/40">
              <span className="text-sky">&#x2713;</span>
              <span className="text-sand/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 11. Platform Overview ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">Platform</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-espresso leading-tight">
          A living model of<br />every neighborhood
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: <Hexagon size={20} />,
              title: '100+ data fields per cell',
              desc: 'Demographics, health, pollution, housing, transit, amenities, schools, network metrics',
            },
            {
              icon: <GitBranch size={20} />,
              title: 'Scenario modeling',
              desc: 'Test infrastructure, policy, investment — see impacts across every dimension',
            },
            {
              icon: <Scale size={20} />,
              title: 'Equity-first analysis',
              desc: 'Displacement risk, equity breakdowns, demographic impact comparisons',
            },
            {
              icon: <Network size={20} />,
              title: 'Network intelligence',
              desc: 'Neighborhoods connected by commute, schools, pollution, housing markets',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 p-5 rounded-xl border border-espresso/10 bg-linen/50"
            >
              <div className="text-driftwood">{item.icon}</div>
              <h3 className="font-display font-bold text-espresso">{item.title}</h3>
              <p className="text-driftwood/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 12. Scenario Modeling ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col lg:flex-row items-center justify-center h-full max-w-4xl mx-auto gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">Versioning</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-linen leading-tight">
            Fork a scenario.<br />Compare futures.
          </h2>
          <p className="text-sand/70 leading-relaxed">
            Start from a shared baseline. Fork scenarios to test different decisions.
            Compare branches side-by-side. Merge the best outcomes. Every change is
            tracked, making collaboration across departments natural.
          </p>
          <p className="text-sand/50 text-sm font-mono">
            City planning as version control.
          </p>
        </div>
        <div className="flex-1 max-h-[40vh] lg:max-h-none">
          <GitDiagram />
        </div>
      </div>
    ),
  },

  /* ── 13. Equity-First ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">Equity</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          Who benefits?<br />
          <span className="text-ember">Who bears the cost?</span>
        </h2>
        <p className="text-sand/70 text-lg leading-relaxed">
          Every scenario is analyzed through an equity lens. See displacement risk,
          cost-benefit breakdowns by demographic group, and ripple effects on
          vulnerable populations.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Displacement risk scoring', icon: <Home size={18} /> },
            { label: 'Demographic impact diffs', icon: <Users size={18} /> },
            { label: 'Environmental justice', icon: <Leaf size={18} /> },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-walnut/40">
              <span className="text-ember">{item.icon}</span>
              <span className="text-sand/80 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 14. Network Intelligence ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">Network Science</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-espresso leading-tight">
          Neighborhoods don&#39;t exist in isolation
        </h2>
        <p className="text-driftwood/80 text-lg leading-relaxed">
          murmur connects neighborhoods through the real networks that bind them — commute patterns,
          school catchments, pollution corridors, housing markets, and economic ties.
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          {['Commute networks', 'School zones', 'Pollution corridors', 'Housing markets', 'Economic linkages'].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-espresso/8 text-driftwood text-sm font-mono"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    ),
  },

  /* ── 16. Scientific Heritage ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">Heritage</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-espresso leading-tight">
          Built by urban scientists
        </h2>
        <p className="text-driftwood/80 text-lg leading-relaxed">
          Murmura Labs builds decision tools for cities — powered by agent-based modeling,
          spatial data science, and generative AI. Inspired by the work of J. Doyne Farmer
          and the complexity economics tradition.
        </p>
        <div className="flex flex-col gap-3 mt-2">
          {[
            { icon: <FlaskConical size={18} />, text: 'Agent-based modeling & complexity science' },
            { icon: <Globe size={18} />, text: 'Spatial data science & GIS' },
            { icon: <Sparkles size={18} />, text: 'Generative AI for scenario generation' },
            { icon: <Microscope size={18} />, text: 'Inspired by J. Doyne Farmer & complexity economics' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 p-3 rounded-lg bg-espresso/5">
              <span className="text-driftwood">{item.icon}</span>
              <span className="text-driftwood/80 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 17. Market Opportunity ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">Market</p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          The right tool doesn&#39;t exist yet
        </h2>
        <p className="text-sand/70 text-lg leading-relaxed">
          City planning tools are stuck in static dashboards and spreadsheets. No platform models
          second-order effects, agent behavior, or networked neighborhoods at scale.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mt-4">
          <Stat value="$4.2B" label="Urban planning software market" />
          <Stat value="10K+" label="Cities in the US alone" />
          <Stat value="0" label="Tools actually modeling cascading effects" />
        </div>
      </div>
    ),
  },

  /* ── 18. Business Model ── */
  {
    theme: 'light',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-driftwood/60 uppercase tracking-[0.2em] text-sm font-mono">Business Model</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso leading-tight">
          SaaS for city intelligence
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: <Target size={20} />,
              title: 'Land with one department',
              desc: 'Planning, housing, or transit — solve one team\'s scenario modeling need',
            },
            {
              icon: <TrendingUp size={20} />,
              title: 'Expand across the city',
              desc: 'Cross-department insights create pull. Health, environment, equity teams follow',
            },
            {
              icon: <BarChart3 size={20} />,
              title: 'Platform subscription',
              desc: 'Annual contracts with city governments. Tiered by city size and module depth',
            },
            {
              icon: <Globe size={20} />,
              title: 'City-to-city network effects',
              desc: 'Replicating murmur for any U.S. city is a matter of days. Shared baselines enable benchmarking and policy transfer across the platform',
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3 p-5 rounded-xl border border-espresso/10">
              <div className="text-driftwood">{item.icon}</div>
              <h3 className="font-display font-bold text-espresso">{item.title}</h3>
              <p className="text-driftwood/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 19. Status & Roadmap ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
        <p className="text-sand/50 uppercase tracking-[0.2em] text-sm font-mono">Status</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-linen leading-tight">
          Where we are today
        </h2>
        <div className="flex flex-col gap-4">
          {[
            { phase: 'Now', items: ['v0.1 live for Bay Area', 'Multi-resolution hex model', 'Scenario engine MVP', '100+ data fields per cell'], color: 'canopy' },
            { phase: 'Next', items: ['Advisor feedback round', 'Equity index refinement', 'Network intelligence layer', 'First pilot city partnerships'], color: 'ember' },
            { phase: 'Later', items: ['Multi-city deployment', 'AI-generated scenario suggestions', 'Public scenario sharing', 'API for third-party tools'], color: 'sky' },
          ].map((col) => (
            <div key={col.phase} className="flex gap-4 p-4 rounded-xl bg-walnut/40">
              <span className={`font-mono text-sm text-${col.color} shrink-0 w-12`}>{col.phase}</span>
              <div className="flex flex-wrap gap-2">
                {col.items.map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-full bg-espresso/50 text-sand/70 text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  /* ── 20. CTA / Contact ── */
  {
    theme: 'dark',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto gap-8">
        <HexLogo size={80} />
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
          Let&#39;s model your city
        </h2>
        <p className="text-sand/70 text-lg">
          Based in San Francisco, working with cities across the Bay Area and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand text-espresso font-display font-bold tracking-wide hover:bg-linen transition-colors"
          >
            murmuralabs.com
          </a>
          <a
            href="https://murmur.murmuralabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sand/30 text-sand font-display font-bold tracking-wide hover:border-sand/60 transition-colors"
          >
            <ExternalLink size={18} />
            Try murmur
          </a>
        </div>
      </div>
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════════════
   PITCH DECK COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function PitchDeck() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')?.toLowerCase() ?? null
  const intro = name ? INTROS[name] ?? null : null

  const allSlides = useMemo(() => {
    if (!intro || !intro.message) return slides
    const introSlide: SlideConfig = {
      theme: 'dark',
      content: (
        <div className="flex flex-col justify-center h-full max-w-3xl mx-auto gap-8">
          <HexLogo size={60} />
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-linen leading-tight">
            {intro.greeting}
          </h2>
          <p className="text-sand/70 text-lg sm:text-xl leading-relaxed">
            {intro.message}
          </p>
          <p className="text-sand/40 text-sm font-mono">
            Swipe or press → to continue
          </p>
        </div>
      ),
    }
    return [introSlide, ...slides]
  }, [intro])

  const [current, setCurrent] = useState(0)
  const total = allSlides.length

  const go = useCallback(
    (dir: -1 | 1) => {
      setCurrent((prev) => Math.max(0, Math.min(total - 1, prev + dir)))
    },
    [total]
  )

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') {
        setCurrent(0)
      } else if (e.key === 'End') {
        setCurrent(total - 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, total])

  /* Touch swipe */
  useEffect(() => {
    let startX = 0
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [go])

  const slide = allSlides[current]
  const isDark = slide.theme === 'dark'
  const hasIntro = allSlides.length > slides.length
  const isIntroSlide = hasIntro && current === 0
  const displayNum = hasIntro ? current : current + 1

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-colors duration-500 ${
        isDark ? 'bg-espresso' : 'bg-linen'
      }`}
    >
      {/* Hex pattern on dark slides */}
      {isDark && <HexPattern />}

      {/* Slide content */}
      <main className="flex-1 relative overflow-y-auto px-5 sm:px-16 py-6 sm:py-12">
        <div
          key={current}
          className="h-full animate-fade-in"
        >
          {slide.content}
        </div>
      </main>

      {/* Bottom nav bar */}
      <nav
        className={`relative z-10 flex items-center justify-between px-5 sm:px-16 py-3 sm:py-4 ${
          isDark ? 'text-sand/60' : 'text-driftwood/60'
        }`}
      >
        {/* Slide counter */}
        <span className="font-mono text-sm tabular-nums w-20">
          {isIntroSlide ? '' : `${String(displayNum).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`}
        </span>

        {/* Progress dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {!isIntroSlide && slides.map((_, i) => {
            const slideIndex = hasIntro ? i + 1 : i
            return (
              <button
                key={i}
                onClick={() => setCurrent(slideIndex)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  slideIndex === current
                    ? isDark
                      ? 'bg-sand w-4'
                      : 'bg-espresso w-4'
                    : isDark
                      ? 'bg-sand/20 hover:bg-sand/40'
                      : 'bg-espresso/20 hover:bg-espresso/40'
                }`}
              />
            )
          })}
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-2 w-20 justify-end">
          <button
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label="Previous slide"
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-20 ${
              isDark ? 'hover:bg-sand/10' : 'hover:bg-espresso/10'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            disabled={current === total - 1}
            aria-label="Next slide"
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-20 ${
              isDark ? 'hover:bg-sand/10' : 'hover:bg-espresso/10'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </nav>
    </div>
  )
}
