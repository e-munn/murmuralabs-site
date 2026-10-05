'use client'

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Splat } from '@react-three/drei'
import { useReducedMotion, type MotionValue } from 'motion/react'
import { CatmullRomCurve3, Matrix4, Vector3 } from 'three'
import railData from './ground-data/noeRail.json'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

// Matches the existing Ground Reconstruction scene. The quaternion includes
// Rx(180°) to cancel drei Splat's coordinate flip before horizon alignment.
const ALIGN: [number, number, number, number] = [0.003436214256554722, 0.8673006391958621, -0.0034027016463509738, 0.4977612030919425]
const SRC = '/ground/noe-14th-15th-render.splat'

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center text-walnut"><p>The 3D preview could not load on this device.</p><a className="underline" href="https://district.murmuralabs.com" target="_blank" rel="noopener noreferrer">Open the Ground viewer ↗</a></div> : this.props.children
  }
}

// Same rail smoothing, scale, eye lift, and lateral offset as the Ground
// Reconstruction asset. The rail is already aligned: do not rotate it again.
function makeRail() {
  const pts = railData.pts.map(([x, y, z]) => new Vector3(x, y, z).multiplyScalar(5).add(new Vector3(0, 6, 5)))
  const a = pts[0], b = pts[pts.length - 1]
  return new CatmullRomCurve3(pts.map((p, i) => p.clone().lerp(a.clone().lerp(b, i / (pts.length - 1)), 0.85)))
}

const smooth = (value: number, lo: number, hi: number) => {
  const t = Math.max(0, Math.min(1, (value - lo) / (hi - lo)))
  return t * t * (3 - 2 * t)
}

function CaptureCamera({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { camera } = useThree()
  const rail = useMemo(makeRail, [])
  const vectors = useMemo(() => ({ position: new Vector3(), ahead: new Vector3(), target: new Vector3(), shift: new Vector3(), matrix: new Matrix4(), up: new Vector3(0, 1, 0), center: new Vector3(0, 6, 5), overview: new Vector3(56, 30, -26) }), [])
  useFrame(() => {
    // Dive during the first visible portion, with no timed orbit intro.
    // Read current scroll even after a slow asset load or an anchor jump.
    const p = progress.get()
    const dive = reduced ? 1 : smooth(p, 0, 0.16)
    const u = reduced ? 0.5 : 0.5 + 0.35 * smooth(p, 0.16, 0.65)
    const v = vectors
    rail.getPointAt(u, v.position)
    rail.getPointAt(Math.min(u + 0.05, 1), v.ahead)
    v.matrix.lookAt(v.position, v.ahead, v.up)
    v.shift.setFromMatrixColumn(v.matrix, 0).multiplyScalar(-4 / (14.997463 / 5))
    v.shift.y -= 1 / (14.997463 / 5)
    v.position.add(v.shift)
    rail.getPointAt(Math.max(u - 0.05, 0), v.target)
    v.target.add(v.shift)
    v.position.y += 0.6
    camera.position.copy(v.overview).lerp(v.position, dive)
    v.ahead.copy(v.center).lerp(v.target, dive)
    camera.lookAt(v.ahead)
  })
  return null
}

function Scene({ rotate, step, onInteract }: { rotate: boolean; step: number; onInteract: () => void }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  useEffect(() => {
    const angle = -0.5 + step * Math.PI / 8
    camera.position.set(64 * Math.cos(angle), 30, 5 + 64 * Math.sin(angle))
    controls.current?.target.set(0, 6, 5)
    controls.current?.update()
  }, [camera, step])
  return <>
    <Suspense fallback={<Html center><p className="whitespace-nowrap text-sm text-walnut bg-linen/90 rounded-full px-5 py-3">Loading Noe Street…</p></Html>}>
      <group position={[0, 6, 5]} scale={5} quaternion={ALIGN}><Splat src={SRC} /></group>
    </Suspense>
    <OrbitControls ref={controls} target={[0, 6, 5]} autoRotate={rotate} autoRotateSpeed={0.45} enableZoom={false} enablePan={false} minPolarAngle={0.2} maxPolarAngle={Math.PI / 2.05} onStart={onInteract} />
  </>
}

export default function GroundSplat({ visible, progress }: { visible: boolean; progress: MotionValue<number> }) {
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<'street' | 'orbit'>('street')
  const [paused, setPaused] = useState(false)
  const [step, setStep] = useState(0)
  const [pageVisible, setPageVisible] = useState(true)
  const [contextLost, setContextLost] = useState(false)
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const rotate = !paused && !reduced && visible && pageVisible
  return <>
    <SceneBoundary>
      {contextLost ? <div className="h-full flex items-center justify-center px-8 text-center text-walnut">The 3D preview paused because graphics memory is unavailable. Reload to try again.</div> : <Canvas camera={{ position: [56, 30, -26], fov: 40, near: 0.1, far: 2000 }} dpr={[1, 1.5]} frameloop={visible && pageVisible ? 'always' : 'never'} gl={{ antialias: false, alpha: true }} fallback={<p className="p-8 text-walnut">Your browser does not support this 3D preview.</p>} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', () => setContextLost(true), { once: true }) }}>
        {mode === 'orbit' ? <Scene rotate={rotate} step={step} onInteract={() => setPaused(true)} /> : <>
          <Suspense fallback={<Html center><p className="whitespace-nowrap text-sm text-walnut bg-linen/90 rounded-full px-5 py-3">Loading Noe Street…</p></Html>}>
            <group position={[0, 6, 5]} scale={5} quaternion={ALIGN}><Splat src={SRC} /></group>
          </Suspense>
          <CaptureCamera progress={progress} reduced={!!reduced} />
        </>}
      </Canvas>}
    </SceneBoundary>
    <div className="absolute top-5 left-5 pointer-events-none text-sm text-walnut font-mono">NOE ST / RECONSTRUCTION</div>
    <div className="absolute bottom-5 inset-x-5 flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-walnut bg-linen/85 rounded-full px-4 py-2 pointer-events-none">{mode === 'street' ? 'Scroll to follow the capture' : 'Drag to rotate'}</span>
      <div className="flex gap-2">
        <button onClick={() => setMode(mode === 'street' ? 'orbit' : 'street')} className="bg-linen/95 text-espresso rounded-full px-4 py-2">{mode === 'street' ? 'Orbit view' : 'Street view'}</button>
        {mode === 'orbit' && <>
        <button aria-label="Rotate model left" onClick={() => { setPaused(true); setStep(step - 1) }} className="bg-linen/95 text-espresso rounded-full w-10 h-10">←</button>
        <button aria-label="Rotate model right" onClick={() => { setPaused(true); setStep(step + 1) }} className="bg-linen/95 text-espresso rounded-full w-10 h-10">→</button>
        {!reduced && <button aria-pressed={paused} onClick={() => setPaused(!paused)} className="bg-linen/95 text-espresso rounded-full px-4 py-2">{paused ? 'Resume rotation' : 'Pause rotation'}</button>}
        </>}
      </div>
    </div>
  </>
}
