'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { LayoutGroup } from 'motion/react'
import ProjectTabs, { type ProjectId } from './ProjectTabs'
import { MurmurSections, SiteNav } from './App'
import GroundVisuals from './GroundVisuals'
import HexGridBackground from './HexGridBackground'

export default function LabsHome() {
  const [activeProject, setActiveProject] = useState<ProjectId>('murmur')
  const [docked, setDocked] = useState(false)
  const projectCards = useRef<HTMLDivElement>(null)
  const scrollToProject = useRef(false)
  const focusedProjectTab = useRef<string | null>(null)

  useEffect(() => {
    const cards = projectCards.current
    if (!cards) return
    let frame = 0
    // Separate entry/exit thresholds prevent trackpad drift from restarting the morph.
    const update = () => {
      frame = 0
      const navBottom = document.getElementById('site-navigation-main')?.getBoundingClientRect().bottom ?? 80
      const distance = cards.getBoundingClientRect().top - (navBottom + 8)
      const focused = document.activeElement?.id
      focusedProjectTab.current = focused?.startsWith('project-tab-') ? focused : null
      setDocked(current => current ? distance < 28 : distance <= 0)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(cards)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    // Keep keyboard focus on the same project as its card moves into/out of the nav.
    const focused = focusedProjectTab.current ?? document.activeElement?.id
    focusedProjectTab.current = null
    const oldPrefix = docked ? 'cards' : 'dock'
    const newPrefix = docked ? 'dock' : 'cards'
    if (focused?.startsWith(`project-tab-${oldPrefix}-`)) {
      document.getElementById(focused.replace(`-${oldPrefix}-`, `-${newPrefix}-`))?.focus({ preventScroll: true })
    }
  }, [docked])

  useEffect(() => {
    let frame = 0
    const followHash = () => {
      const project = window.location.hash.slice(1)
      if (project !== 'murmur' && project !== 'ground') return
      setActiveProject(project)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => document.getElementById(project)?.scrollIntoView({ block: 'start' }))
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    window.addEventListener('popstate', followHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', followHash)
      window.removeEventListener('popstate', followHash)
    }
  }, [])

  useLayoutEffect(() => {
    if (!scrollToProject.current) return
    scrollToProject.current = false
    document.getElementById(activeProject)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [activeProject])

  function selectProject(project: ProjectId, compact: boolean) {
    if (project === activeProject) return
    // Switching while deep in a project should land at the new project's start.
    scrollToProject.current = compact
    setActiveProject(project)
    const url = new URL(window.location.href)
    url.hash = project
    window.history.replaceState(null, '', url)
  }

  return (
    <LayoutGroup id="home-projects">
    <div className="min-h-screen bg-linen text-espresso">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-linen focus:p-4">Skip to main content</a>
      <SiteNav links={[
        { label: 'Platform', href: activeProject === 'murmur' ? '#platform' : '#ground' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
      ]} projectRow={docked ? <ProjectTabs active={activeProject} onSelect={selectProject} compact /> : undefined} />
      <main id="main-content">
        <section className="relative overflow-hidden min-h-svh flex items-center justify-center px-6 sm:px-10 py-32">
          <HexGridBackground delay={500} />
          <div className="relative text-center max-w-5xl mx-auto">
            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-espresso lowercase leading-tight tracking-[0.16em]">murmura labs</h1>
            <p className="mt-7 text-base sm:text-lg text-driftwood tracking-[0.08em]">urban science &amp; technology</p>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-title" className="w-full scroll-mt-28 border-y border-sand/30 px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 id="projects-title" className="font-mono text-xs text-driftwood uppercase tracking-[0.2em] mb-5">Two projects from the lab</h2>
            <div ref={projectCards} aria-hidden={docked || undefined} inert={docked} style={{ visibility: docked ? 'hidden' : 'visible' }}>
              <ProjectTabs key={docked ? 'placeholder' : 'cards'} active={activeProject} onSelect={selectProject} placeholder={docked} />
            </div>
          </div>
        </section>

        <section id="murmur" role="tabpanel" aria-labelledby={`project-tab-${docked ? 'dock' : 'cards'}-murmur`} hidden={activeProject !== 'murmur'} tabIndex={0} className="scroll-mt-48">
          {activeProject === 'murmur' && <MurmurSections />}
        </section>

        <section id="ground" role="tabpanel" aria-labelledby={`project-tab-${docked ? 'dock' : 'cards'}-ground`} hidden={activeProject !== 'ground'} tabIndex={0} className="scroll-mt-48">
          {activeProject === 'ground' && <GroundVisuals />}
        </section>

        <section id="about" className="scroll-mt-44 px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-24">
            <div><p className="font-mono text-sm uppercase tracking-[0.18em] text-driftwood mb-6">About the lab</p><h2 className="font-display text-4xl sm:text-5xl leading-tight">Fieldwork meets<br />software.</h2></div>
            <div className="text-lg text-walnut leading-relaxed"><p>Murmura Labs is an independent lab founded by Elijah, based in San Francisco. The work spans geospatial data engineering, urban modeling, 3D reconstruction, and interactive web tools.</p><p className="mt-5">We explore how data, fieldwork, and software can help us understand and improve the built environment.</p><p className="mt-5">For engineering opportunities, research collaborations, or a focused pilot:</p><a id="contact" href="mailto:hello@murmuralabs.com" className="scroll-mt-44 inline-flex items-center gap-2 mt-5 font-medium text-espresso underline underline-offset-4 break-all">hello@murmuralabs.com <ArrowUpRight size={18} aria-hidden="true" /></a></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-espresso/20 px-6 sm:px-10 py-7"><div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-4 text-sm text-driftwood"><span>© {new Date().getFullYear()} Murmura Labs</span><span>San Francisco</span></div></footer>
    </div>
    </LayoutGroup>
  )
}
