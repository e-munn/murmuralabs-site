import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

const DOLORES: [number, number] = [-122.42669625703857, 37.76505161652456]

export default function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!mapboxgl.accessToken) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        imports: [{
          id: 'basemap',
          url: 'mapbox://styles/mapbox/standard',
          config: {
            theme: 'warm',
            lightPreset: 'dusk',
            showPointOfInterestLabels: false,
            showTransitLabels: false,
            showPlaceLabels: false,
            showRoadLabels: false,
            colorLand: 'hsl(30, 35%, 86%)',
            colorBuildings: 'hsl(30, 22%, 82%)',
            colorCommercial: 'hsla(0, 38%, 55%, 0.00)',
            colorGreenspace: 'hsl(148, 10%, 77%)',
            colorWater: 'hsl(210, 22%, 58%)',
            colorRoads: 'hsl(30, 15%, 75%)',
            show3dObjects: true,
            showPedestrianRoads: true,
            showAdminBoundaries: false,
            showNaturalFeatures: true,
          },
        }],
        sources: {},
        layers: [],
      } as any,
      center: DOLORES,
      zoom: 16,
      pitch: 55,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    })

    // Slow orbit
    map.on('load', () => {
      const speed = 0.15 // degrees per frame
      let bearing = 0

      function orbit() {
        bearing = (bearing + speed) % 360
        map.setBearing(bearing)
        frameRef.current = requestAnimationFrame(orbit)
      }

      frameRef.current = requestAnimationFrame(orbit)
    })

    mapRef.current = map

    return () => {
      cancelAnimationFrame(frameRef.current)
      map.remove()
      mapRef.current = null
    }
  }, [])

  if (!mapboxgl.accessToken) {
    return (
      <div className="w-full h-full rounded-2xl bg-espresso/50 border border-linen/10" />
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden opacity-60 [&_.mapboxgl-ctrl-logo]:!w-16 [&_.mapboxgl-ctrl-logo]:!h-4"
      />
      {/* Logo overlay — fixed in center, no jitter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="-60 -60 120 120" className="w-10 h-10">
          <polygon points="37.71,-29.69 44.57,17.82 6.86,47.51 -37.71,29.69 -44.57,-17.82 -6.86,-47.51" fill="#FF6A00" opacity="0.15" />
          <polygon points="38.55,-13.35 30.84,26.71 -7.71,40.06 -38.55,13.35 -30.84,-26.71 7.71,-40.06" fill="#FF6A00" opacity="0.4" />
          <polygon points="34.68,0 17.34,30.03 -17.34,30.03 -34.68,0 -17.34,-30.03 17.34,-30.03" fill="#FF6A00" stroke="#FF6A00" strokeWidth="1" opacity="0.9" />
        </svg>
      </div>
    </div>
  )
}
