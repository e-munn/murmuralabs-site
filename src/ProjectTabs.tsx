'use client'

import type { KeyboardEvent } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

export const PROJECTS = [
  { id: 'murmur', number: '01', name: 'murmur-v1', category: 'Urban foresight', description: 'Explore city data and model how urban decisions could affect neighborhoods.' },
  { id: 'ground', number: '02', name: 'murmura-ground-v1', category: 'Street-level reconstruction', description: 'Turn real street captures into 3D places you can explore in your browser.' },
] as const

export type ProjectId = typeof PROJECTS[number]['id']

export default function ProjectTabs({ active, onSelect, compact = false, placeholder = false }: {
  active: ProjectId
  onSelect: (project: ProjectId, compact: boolean) => void
  compact?: boolean
  placeholder?: boolean
}) {
  const prefix = compact ? 'dock' : 'cards'
  const reduced = useReducedMotion()
  // Card and title must settle together; nested default springs lagged behind.
  const morph = { duration: reduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] as const }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % PROJECTS.length
    else if (event.key === 'ArrowLeft') next = (index + PROJECTS.length - 1) % PROJECTS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = PROJECTS.length - 1
    else return
    event.preventDefault()
    const project = PROJECTS[next]
    onSelect(project.id, compact)
    document.getElementById(`project-tab-${prefix}-${project.id}`)?.focus({ preventScroll: true })
  }

  return (
    <div role="tablist" aria-label="Lab projects" className={compact ? 'grid grid-cols-2 gap-2 p-2 w-full' : 'grid sm:grid-cols-2 gap-4 sm:gap-6'}>
      {PROJECTS.map((project, index) => {
        const selected = active === project.id
        return (
          <motion.button
            key={project.id}
            layoutId={placeholder ? undefined : `project-${project.id}`}
            transition={{ layout: morph }}
            style={{ borderRadius: 16 }}
            id={`project-tab-${prefix}-${project.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={project.id}
            aria-label={project.name}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(project.id, compact)}
            onKeyDown={event => handleKey(event, index)}
            className={compact
              ? `flex min-h-14 sm:min-h-16 min-w-0 items-center justify-center gap-2 border px-3 sm:px-6 py-3 text-xs sm:text-base font-display font-bold transition-colors ${selected ? 'border-espresso/80 bg-espresso/90 text-linen' : 'border-sand/40 bg-linen/20 text-walnut hover:bg-sand/20'}`
              : `group flex flex-col text-left rounded-2xl border p-6 sm:p-8 transition-colors ${selected ? 'border-espresso bg-espresso text-linen' : 'border-sand/60 bg-linen text-espresso hover:bg-sand/20 hover:border-driftwood/50'}`}
          >
            {compact ? <>
              <span className="hidden sm:inline opacity-60 font-mono text-xs" aria-hidden="true">{project.number}</span>
              <motion.span layoutId={placeholder ? undefined : `project-name-${project.id}`} transition={{ layout: morph }} className="break-words">{project.name}</motion.span>
              {selected && <Check size={14} className="shrink-0" aria-hidden="true" />}
            </> : <>
              <span className={`flex w-full items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.12em] ${selected ? 'text-sand' : 'text-driftwood'}`}>
                <span>{project.category}</span><span aria-hidden="true">{project.number}</span>
              </span>
              <motion.span layoutId={placeholder ? undefined : `project-name-${project.id}`} transition={{ layout: morph }} className="mt-5 font-display font-bold text-2xl sm:text-3xl tracking-wide break-words">{project.name}</motion.span>
              <span className={`mt-3 mb-7 max-w-sm text-sm sm:text-base leading-relaxed ${selected ? 'text-linen/80' : 'text-walnut'}`}>{project.description}</span>
              <span className="mt-auto flex w-full items-center justify-between gap-4 text-sm font-medium">
                {selected ? 'Selected project' : 'View project'}
                {selected ? <Check size={18} aria-hidden="true" /> : <ArrowDown size={18} aria-hidden="true" />}
              </span>
            </>}
          </motion.button>
        )
      })}
    </div>
  )
}
