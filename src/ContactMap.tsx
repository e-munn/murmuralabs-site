import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

export default function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

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
            lightPreset: 'dawn',
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
          },
        }],
        sources: {},
        layers: [],
      } as any,
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 11,
      interactive: false,
      attributionControl: false,
    })

    mapRef.current = map

    return () => {
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
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden opacity-60 [&_.mapboxgl-ctrl-logo]:!w-16 [&_.mapboxgl-ctrl-logo]:!h-4"
    />
  )
}
