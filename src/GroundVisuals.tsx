'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight } from 'lucide-react'
import { useInView, useScroll } from 'motion/react'
import CoverageMap from './CoverageMap'

const GroundSplat = dynamic(() => import('./GroundSplat'), { ssr: false, loading: () => <div className="h-full flex items-center justify-center text-driftwood">Preparing street reconstruction…</div> })

export default function GroundVisuals() {
  const modelRef = useRef<HTMLDivElement>(null)
  const near = useInView(modelRef, { margin: '1000px', once: true })
  const visible = useInView(modelRef, { amount: 0.01 })
  const { scrollYProgress } = useScroll({ target: modelRef, offset: ['start end', 'end start'] })

  return <>
    <section className="py-24 sm:py-32 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-2">
          <p className="font-mono text-xs text-driftwood tracking-[0.3em] uppercase mb-4">murmura-ground-v1</p>
          <h2 id="ground-title" className="font-bold text-3xl sm:text-4xl text-espresso mb-6 leading-tight">The city,<br />at street level.</h2>
          <p className="text-lg text-driftwood leading-relaxed">Ground turns street-level video into 3D Gaussian splats you can explore in a browser. Captures are reconstructed, aligned, and placed in a shared coordinate frame, one street segment at a time.</p>
          <p className="mt-5 text-lg text-driftwood leading-relaxed">The work starts with San Francisco sidewalks: building a repeatable visual record of the places we move through every day.</p>
          <a href="https://district.murmuralabs.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 mt-8 bg-espresso text-linen rounded-full px-6 py-3 font-medium hover:bg-walnut transition-colors">Explore Ground <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <figure className="lg:col-span-3 min-w-0">
          <div ref={modelRef} className="relative aspect-[4/3] lg:aspect-square min-h-[340px] bg-[#edcfb3] rounded-2xl overflow-hidden border border-sand/30">
            {near ? <GroundSplat visible={visible} progress={scrollYProgress} /> : <div className="h-full flex items-center justify-center text-driftwood">Noe Street · 3D reconstruction</div>}
          </div>
          <figcaption className="flex flex-wrap justify-between gap-2 pt-4 text-xs text-driftwood"><span>Noe Street · 14th to 15th · San Francisco</span><span>Reconstructed from a real street capture</span></figcaption>
        </figure>
      </div>
    </section>

    <section className="bg-espresso text-linen py-24 sm:py-32 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 min-w-0 order-2 lg:order-1">
          <CoverageMap />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2 lg:pl-4">
          <p className="font-mono text-xs text-sand tracking-[0.3em] uppercase mb-4">The capture route</p>
          <h2 className="font-bold text-3xl sm:text-4xl text-linen mb-6 leading-tight">Every capture<br />adds to the record.</h2>
          <p className="text-lg text-sand leading-relaxed">A recorded pass through the Mission, traced over the street grid. Each route becomes the source material for individual reconstructions.</p>
          <p className="mt-5 text-base text-sand leading-relaxed">The route shows where capture took place. Each street segment is reconstructed and aligned separately before it can become part of the shared scene.</p>
        </div>
      </div>
    </section>
  </>
}
