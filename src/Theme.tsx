import { useRef } from 'react'
import HexGridBackground from './HexGridBackground'

const AP7_ROT = Math.atan2(Math.sqrt(3), 5)
function hexPoints(cx: number, cy: number, r: number, rot = 0): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
}

const SURFACE_COLORS = [
  { name: 'Espresso', var: 'espresso', hex: '#190f0a', rgb: '25, 15, 10' },
  { name: 'Walnut', var: 'walnut', hex: '#3f2a1c', rgb: '63, 42, 28' },
  { name: 'Driftwood', var: 'driftwood', hex: '#7f5e46', rgb: '127, 94, 70' },
  { name: 'Sand', var: 'sand', hex: '#c6a181', rgb: '198, 161, 129' },
  { name: 'Linen', var: 'linen', hex: '#FFE4CC', rgb: '255, 228, 204' },
]

const SIGNAL_COLORS = [
  { name: 'Canopy', var: 'canopy', hex: '#16a34a', meaning: 'Good', usage: 'Flowing, healthy, on-track, confirmed' },
  { name: 'Ember', var: 'ember', hex: '#ea580c', meaning: 'Attention', usage: 'Action needed, thresholds, warnings' },
  { name: 'Danger', var: 'danger', hex: '#dc2626', meaning: 'Bad', usage: 'Errors, failures, blocked, destructive' },
  { name: 'Sky', var: 'sky', hex: '#0284c7', meaning: 'Noteworthy', usage: 'Anomalies, insights, special indicators' },
]

const DARK_SURFACE = [
  { name: 'Linen', hex: '#0d1117' },
  { name: 'Sand', hex: '#3a4255' },
  { name: 'Driftwood', hex: '#7a8499' },
  { name: 'Walnut', hex: '#c8d0e0' },
  { name: 'Espresso', hex: '#eef1f7' },
]

const FONTS = [
  { name: 'Quicksand', use: 'Hero / murmur wordmark', weight: '700', sample: 'murmur', style: { fontFamily: "'Quicksand', sans-serif", fontWeight: 700, letterSpacing: '0.22em' } },
  { name: 'Quicksand', use: 'Logo text / murmura labs', weight: '700', sample: 'murmura labs', style: { fontFamily: "'Quicksand', sans-serif", fontWeight: 700, letterSpacing: '0.22em' } },
  { name: 'Inter', use: 'Body / UI text', weight: '400-600', sample: 'Agent based simulations at the urban scale.', style: { fontFamily: "'Inter', sans-serif", fontWeight: 400 } },
  { name: 'JetBrains Mono', use: 'Code / mono accents', weight: '400-500', sample: '{ displacement_risk: 0.73 }', style: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 } },
]

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

function LogoSVG({ dark = false, size = 120 }: { dark?: boolean; size?: number }) {
  const color = dark ? '#c6a181' : '#190f0a'
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <polygon points={hexPoints(0, 0, 48, -AP7_ROT * 2)} fill={color} stroke="none" opacity="0.08" />
      <polygon points={hexPoints(0, 0, 48 * 0.85, -AP7_ROT)} fill={color} stroke="none" opacity="0.2" />
      <polygon points={hexPoints(0, 0, 48 * 0.85 * 0.85, 0)} fill={color} stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function FaviconSVG({ dark = false, size = 64 }: { dark?: boolean; size?: number }) {
  const color = dark ? '#c6a181' : '#190f0a'
  const bg = dark ? '#190f0a' : '#FFE4CC'
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill={bg} />
      <g transform="translate(16, 16)">
        <polygon points={hexPoints(0, 0, 12, -AP7_ROT * 2)} fill={color} opacity={0.15} />
        <polygon points={hexPoints(0, 0, 12 * 0.85, -AP7_ROT)} fill={color} opacity={0.35} />
        <polygon points={hexPoints(0, 0, 12 * 0.85 * 0.85, 0)} fill={color} stroke={color} strokeWidth={0.3} opacity={0.85} />
      </g>
    </svg>
  )
}

function downloadSVG(dark: boolean) {
  const color = dark ? '#c6a181' : '#190f0a'
  const svg = `<svg viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${hexPoints(0, 0, 48, -AP7_ROT * 2)}" fill="${color}" stroke="none" opacity="0.08"/>
  <polygon points="${hexPoints(0, 0, 48 * 0.85, -AP7_ROT)}" fill="${color}" stroke="none" opacity="0.2"/>
  <polygon points="${hexPoints(0, 0, 48 * 0.85 * 0.85, 0)}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.6"/>
</svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `murmuralabs-logo-${dark ? 'dark' : 'light'}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPNG(canvasRef: React.RefObject<HTMLCanvasElement | null>, dark: boolean) {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const size = 512
  canvas.width = size
  canvas.height = size
  ctx.clearRect(0, 0, size, size)
  if (dark) {
    ctx.fillStyle = '#190f0a'
    ctx.fillRect(0, 0, size, size)
  }
  const img = new Image()
  const color = dark ? '#c6a181' : '#190f0a'
  const svg = `<svg viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <polygon points="${hexPoints(0, 0, 48, -AP7_ROT * 2)}" fill="${color}" stroke="none" opacity="0.08"/>
    <polygon points="${hexPoints(0, 0, 48 * 0.85, -AP7_ROT)}" fill="${color}" stroke="none" opacity="0.2"/>
    <polygon points="${hexPoints(0, 0, 48 * 0.85 * 0.85, 0)}" fill="${color}" stroke="${color}" stroke-width="1" opacity="0.6"/>
  </svg>`
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `murmuralabs-logo-${dark ? 'dark' : 'light'}.png`
    a.click()
  }
  img.src = 'data:image/svg+xml;base64,' + btoa(svg)
}

export default function Theme() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="min-h-screen bg-linen text-espresso p-8 sm:p-16">
      <canvas ref={canvasRef} className="hidden" />

      <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-2">Murmura Labs</h1>
      <p className="text-3xl font-bold mb-16">Brand Theme</p>

      {/* Logo Mark + Favicon */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Logo Mark</h2>
        <div className="grid sm:grid-cols-2 gap-8 mb-8">
          <div className="border border-sand/30 rounded-2xl p-12 flex flex-col items-center gap-6">
            <LogoSVG size={140} />
            <p className="font-mono text-xs text-driftwood/60">Light variant</p>
            <div className="flex gap-3">
              <button onClick={() => downloadSVG(false)} className="font-mono text-xs bg-espresso text-linen px-4 py-2 rounded-full hover:bg-walnut transition-colors">
                SVG
              </button>
              <button onClick={() => downloadPNG(canvasRef, false)} className="font-mono text-xs border border-sand/40 px-4 py-2 rounded-full hover:bg-sand/10 transition-colors">
                PNG
              </button>
            </div>
          </div>
          <div className="bg-espresso rounded-2xl p-12 flex flex-col items-center gap-6">
            <LogoSVG dark size={140} />
            <p className="font-mono text-xs text-sand/60">Dark variant</p>
            <div className="flex gap-3">
              <button onClick={() => downloadSVG(true)} className="font-mono text-xs bg-linen text-espresso px-4 py-2 rounded-full hover:bg-sand transition-colors">
                SVG
              </button>
              <button onClick={() => downloadPNG(canvasRef, true)} className="font-mono text-xs border border-sand/40 text-linen px-4 py-2 rounded-full hover:bg-sand/10 transition-colors">
                PNG
              </button>
            </div>
          </div>
        </div>

        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-driftwood/60 mb-4 mt-12">Favicon</h3>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="border border-sand/30 rounded-2xl p-8 flex items-center gap-6">
            <FaviconSVG size={64} />
            <div>
              <p className="font-mono text-sm font-medium">Light</p>
              <p className="font-mono text-xs text-driftwood/60">Rounded "m" on espresso</p>
            </div>
          </div>
          <div className="bg-espresso rounded-2xl p-8 flex items-center gap-6">
            <FaviconSVG dark size={64} />
            <div>
              <p className="font-mono text-sm font-medium text-linen">Dark</p>
              <p className="font-mono text-xs text-sand/60">Rounded "m" on sand</p>
            </div>
          </div>
        </div>

        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-driftwood/60 mb-4 mt-12">Social OG Image</h3>
        <div className="border border-sand/30 rounded-2xl p-8">
          <img
            src="/og-image.png"
            alt="Murmura Labs OG social share image — 1200x630"
            className="w-full rounded-lg border border-sand/20"
          />
          <div className="flex items-center justify-between mt-4">
            <p className="font-mono text-xs text-driftwood/60">1200 &times; 630px &middot; Used for Twitter, LinkedIn, Slack previews</p>
            <a
              href="/og-image.png"
              download="murmuralabs-og.png"
              className="font-mono text-xs border border-sand/40 px-4 py-2 rounded-full hover:bg-sand/10 transition-colors"
            >
              PNG
            </a>
          </div>
        </div>
      </section>

      {/* Surface Colors */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Surface Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {SURFACE_COLORS.map((c) => (
            <div key={c.name} className="group">
              <div
                className="aspect-square rounded-xl mb-3 cursor-pointer hover:scale-105 transition-transform border border-sand/20"
                style={{ backgroundColor: c.hex }}
                onClick={() => copyToClipboard(c.hex)}
                title="Click to copy hex"
              />
              <p className="font-mono text-sm font-medium">{c.name}</p>
              <p className="font-mono text-xs text-driftwood/60 cursor-pointer hover:text-driftwood transition-colors" onClick={() => copyToClipboard(c.hex)}>
                {c.hex}
              </p>
              <p className="font-mono text-xs text-driftwood/40 cursor-pointer hover:text-driftwood transition-colors" onClick={() => copyToClipboard(`rgb(${c.rgb})`)}>
                rgb({c.rgb})
              </p>
              <p className="font-mono text-xs text-driftwood/40 cursor-pointer hover:text-driftwood transition-colors" onClick={() => copyToClipboard(c.var)}>
                tw: {c.var}
              </p>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-driftwood/40 mt-4">Click any value to copy</p>
      </section>

      {/* Signal Colors */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Signal Colors</h2>
        <p className="font-mono text-xs text-driftwood/60 mb-6">Semantic colors by meaning. Never decorative.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SIGNAL_COLORS.map((c) => (
            <div key={c.name} className="group">
              <div
                className="aspect-[2/1] rounded-xl mb-3 cursor-pointer hover:scale-105 transition-transform flex items-end p-3"
                style={{ backgroundColor: c.hex }}
                onClick={() => copyToClipboard(c.hex)}
                title="Click to copy hex"
              >
                <span className="font-mono text-[10px] text-white/80">{c.meaning}</span>
              </div>
              <p className="font-mono text-sm font-medium">{c.name}</p>
              <p className="font-mono text-xs text-driftwood/60 cursor-pointer hover:text-driftwood transition-colors" onClick={() => copyToClipboard(c.hex)}>
                {c.hex}
              </p>
              <p className="font-mono text-xs text-driftwood/40">{c.usage}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border border-sand/20 rounded-xl p-6">
          <p className="font-mono text-xs text-driftwood/60 mb-4">Signal tints (16% opacity badge backgrounds)</p>
          <div className="flex flex-wrap gap-3">
            {SIGNAL_COLORS.map((c) => (
              <span
                key={c.name}
                className="font-mono text-xs px-3 py-1.5 rounded-full"
                style={{ backgroundColor: c.hex + '28', color: c.hex }}
              >
                {c.name.toLowerCase()} tint
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Mode Palette */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Dark Mode Palette</h2>
        <div className="bg-[#0d1117] rounded-2xl p-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {DARK_SURFACE.map((c) => (
              <div key={c.name} className="group">
                <div
                  className="aspect-square rounded-xl mb-3 cursor-pointer hover:scale-105 transition-transform border border-white/10"
                  style={{ backgroundColor: c.hex }}
                  onClick={() => copyToClipboard(c.hex)}
                  title="Click to copy hex"
                />
                <p className="font-mono text-sm font-medium text-[#c8d0e0]">{c.name}</p>
                <p className="font-mono text-xs text-[#7a8499] cursor-pointer hover:text-[#c8d0e0] transition-colors" onClick={() => copyToClipboard(c.hex)}>
                  {c.hex}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glass Patterns */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Glass Patterns</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden bg-linen" style={{ minHeight: 200 }}>
            <HexGridBackground />
            <div className="relative z-10 p-8">
              <div className="bg-[#e8cdb3]/60 backdrop-blur-md border border-[#d4b89a]/40 rounded-xl p-6">
                <p className="font-mono text-xs text-driftwood/60 mb-2">GLASS_WARM</p>
                <p className="font-mono text-[10px] text-driftwood/50 leading-relaxed">
                  bg-[#e8cdb3]/60 backdrop-blur-md
                  <br />border border-[#d4b89a]/40
                </p>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-espresso" style={{ minHeight: 200 }}>
            <HexGridBackground dark />
            <div className="relative z-10 p-8">
              <div className="bg-[#1a1f2e]/75 backdrop-blur-md border border-white/[0.08] rounded-xl p-6">
                <p className="font-mono text-xs text-[#7a8499] mb-2">GLASS_DARK</p>
                <p className="font-mono text-[10px] text-[#7a8499]/70 leading-relaxed">
                  bg-[#1a1f2e]/75 backdrop-blur-md
                  <br />border border-white/8
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Typography</h2>
        <div className="space-y-8">
          {FONTS.map((f, i) => (
            <div key={`${f.name}-${i}`} className="border border-sand/20 rounded-xl p-8">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-driftwood/60">{f.name} · {f.weight}</p>
                  <p className="font-mono text-xs text-driftwood/40">{f.use}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`font-family: '${f.name}', ${f.name === 'Inter' || f.name === 'Quicksand' ? 'sans-serif' : 'monospace'};`)}
                  className="font-mono text-xs text-driftwood/40 hover:text-driftwood transition-colors"
                >
                  Copy CSS
                </button>
              </div>
              <p className="text-3xl" style={f.style}>{f.sample}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logo + Wordmark lockup */}
      <section className="mb-20">
        <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-driftwood mb-8">Lockups</h2>
        <div className="space-y-6">
          <div className="border border-sand/20 rounded-xl p-8 flex items-center gap-4">
            <LogoSVG size={40} />
            <span className="text-2xl tracking-[0.22em] lowercase" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmura labs</span>
          </div>
          <div className="bg-espresso rounded-xl p-8 flex items-center gap-4">
            <LogoSVG dark size={40} />
            <span className="text-2xl tracking-[0.22em] lowercase text-linen" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmura labs</span>
          </div>
          <div className="border border-sand/20 rounded-xl p-8 flex items-center gap-4">
            <LogoSVG size={40} />
            <span className="text-2xl lowercase tracking-[0.22em]" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmur</span>
          </div>
          <div className="bg-espresso rounded-xl p-8 flex items-center gap-4">
            <LogoSVG dark size={40} />
            <span className="text-2xl lowercase tracking-[0.22em] text-linen" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmur</span>
          </div>
          {/* Favicon lockups */}
          <div className="border border-sand/20 rounded-xl p-8 flex items-center gap-4">
            <FaviconSVG size={40} />
            <span className="text-2xl lowercase tracking-[0.22em]" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmur</span>
          </div>
          <div className="bg-espresso rounded-xl p-8 flex items-center gap-4">
            <FaviconSVG dark size={40} />
            <span className="text-2xl lowercase tracking-[0.22em] text-linen" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>murmur</span>
          </div>
        </div>
      </section>
    </div>
  )
}
