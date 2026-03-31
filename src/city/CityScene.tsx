import { useEffect, useCallback, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import uniqBy from 'lodash/uniqBy'

// City components
import { GRID_ANGLE } from './Grid'
import { Roads, FlowParticles } from './Roads'
import { InstancedPalmTrees } from './Trees'
import { DetailedBuildings } from './Buildings'
import { ParkingZones, BikeLanes } from './Infrastructure'
import { BusStopMarkers, BicingMarkers, TrafficViolationMarkers } from './Markers'
import { FadeInLayer } from './LayerAnimations'
import { useCityData, type CityData } from '../hooks/useCityData'
import { useLayerStore, type LayerKey } from '../stores/layerStore'
import { usePaletteStore } from '../stores/paletteStore'
import { SIZE_ZOOMS, SIZE_RADII, type SizeMode } from '../stores/sizeStore'
import { filterPointsByRadius, filterRoadsByRadius, isWithinHex } from './data'

// Screen width breakpoints for size mode
const SIZE_BREAKPOINTS = {
  small: 900,   // < 900px = small
  // >= 900px = medium (large disabled for performance)
}

// Determine size mode from screen width (large disabled)
function getSizeModeFromWidth(width: number): SizeMode {
  if (width < SIZE_BREAKPOINTS.small) return 'small'
  return 'medium' // Use medium for all larger screens
}

// Scene
interface SceneProps extends CityData {
  revealed: Record<LayerKey, boolean>
  buildingColor: string
  buildingOpacity: number
  dotGridColor: string
  getLayerOpacity: (layer: LayerKey) => number
  sizeMode: SizeMode
}

function Scene({
  roads,
  trees,
  buildings,
  busStops,
  bicingStations,
  trafficViolations,
  parkingZones,
  bikeLanes,
  revealed,
  buildingColor,
  buildingOpacity,
  dotGridColor: _dotGridColor,
  getLayerOpacity,
  sizeMode,
}: SceneProps) {
  const { camera, size } = useThree()

  const dist = 500
  const orbitAngle = Math.PI / 4
  const elevation = Math.atan(1 / Math.sqrt(2))

  // Calculate responsive offset and zoom based on viewport and size mode
  useEffect(() => {
    const orthoCamera = camera as THREE.OrthographicCamera

    // Zoom based on size mode — scale to canvas size, not full viewport
    const sizeZoom = SIZE_ZOOMS[sizeMode]
    const viewportScale = Math.min(size.width / 1300, size.height / 1300)
    orthoCamera.zoom = Math.max(0.5, Math.min(3.5, sizeZoom * viewportScale * 1.25))

    camera.position.set(
      dist * Math.cos(orbitAngle) * Math.cos(elevation),
      dist * Math.sin(orbitAngle) * Math.cos(elevation),
      dist * Math.sin(elevation)
    )
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size, sizeMode])

  return (
    <group rotation={[0, 0, -GRID_ANGLE]} position={[0, 0, -40]}>
      {/* Fade-in layers */}
      <FadeInLayer revealed={revealed.roads} duration={0.8} delay={0.1}>
        <Roads roads={roads} opacity={getLayerOpacity('roads')} />
      </FadeInLayer>
      <FadeInLayer revealed={revealed.parking} duration={0.8} delay={0.05}>
        <ParkingZones zones={parkingZones} opacity={0.6 * getLayerOpacity('parking')} />
      </FadeInLayer>
      <FadeInLayer revealed={revealed.bikeLanes} duration={0.8} delay={0.1}>
        <BikeLanes lanes={bikeLanes} color='#16a34a' lineWidth={2} opacity={getLayerOpacity('bikeLanes')} />
      </FadeInLayer>
      <FadeInLayer revealed={revealed.trees} duration={1.0} delay={0.15}>
        <InstancedPalmTrees positions={trees} opacity={getLayerOpacity('trees')} />
      </FadeInLayer>
      <FadeInLayer revealed={revealed.flowParticles} duration={0.6}>
        <FlowParticles roads={roads} opacity={getLayerOpacity('flowParticles')} />
      </FadeInLayer>
      <FadeInLayer revealed={revealed.buildings} duration={1.2} delay={0.1}>
        <DetailedBuildings
          buildings={buildings}
          color={buildingColor}
          fillOpacity={buildingOpacity * getLayerOpacity('buildings')}
          edgeOpacity={0}
        />
      </FadeInLayer>

      {/* Data markers with built-in per-marker staggered drop animations */}
      {revealed.busStops && (
        <BusStopMarkers positions={busStops.map((s) => s.position)} opacity={getLayerOpacity('busStops')} />
      )}
      {revealed.bicingStations && (
        <BicingMarkers positions={bicingStations.map((s) => s.position)} opacity={getLayerOpacity('bicingStations')} />
      )}
      {revealed.trafficViolations && (
        <TrafficViolationMarkers
          positions={uniqBy(trafficViolations, v => `${v.position[0]},${v.position[1]}`).map((v) => v.position)}
          opacity={getLayerOpacity('trafficViolations')}
        />
      )}
    </group>
  )
}

// Main component
export default function CityScene() {
  // Use the centralized data loading hook
  const { data } = useCityData()
  const { roads, trees, buildings, busStops, bicingStations, trafficViolations, parkingZones, bikeLanes } = data

  // Get revealed state from store
  const revealed = useLayerStore((state) => state.revealed)
  const hoveredLayers = useLayerStore((state) => state.hoveredLayers)

  // Get palette from store
  const { palette, customBuildingColor, customBuildingOpacity } = usePaletteStore()

  // Auto-determine size mode from screen width (medium default, large disabled)
  const [sizeMode, setSizeMode] = useState<SizeMode>('medium')

  useEffect(() => {
    const updateSizeMode = () => {
      setSizeMode(getSizeModeFromWidth(window.innerWidth))
    }
    updateSizeMode()
    window.addEventListener('resize', updateSizeMode)
    return () => window.removeEventListener('resize', updateSizeMode)
  }, [])

  // Get radius for current size mode
  const radius = SIZE_RADII[sizeMode]

  // Filter all data layers by radius (memoized)
  const filteredData = useMemo(() => {
    return {
      roads: filterRoadsByRadius(roads, radius),
      trees: filterPointsByRadius(trees, radius),
      buildings: buildings.filter(b => isWithinHex(b.centroid[0], b.centroid[1], radius)),
      busStops: busStops.filter(s => isWithinHex(s.position[0], s.position[1], radius)),
      bicingStations: bicingStations.filter(s => isWithinHex(s.position[0], s.position[1], radius)),
      trafficViolations: trafficViolations.filter(v => isWithinHex(v.position[0], v.position[1], radius)),
      parkingZones: parkingZones.filter(z => isWithinHex(z.startPos[0], z.startPos[1], radius)),
      bikeLanes: bikeLanes.filter(l => {
        // Check if any point in the lane is within radius
        return l.path.some(([x, y]) => isWithinHex(x, y, radius))
      }),
    }
  }, [roads, trees, buildings, busStops, bicingStations, trafficViolations, parkingZones, bikeLanes, radius])

  // Calculate opacity for a layer based on hover state
  const getLayerOpacity = useCallback((layer: LayerKey): number => {
    // If nothing is hovered, everything is at full opacity
    if (hoveredLayers === null) return 1
    // Hovered layers get a brightness boost, others dim
    if (hoveredLayers.includes(layer)) {
      // Boost trees and buildings more since they're visually subtle
      if (layer === 'trees' || layer === 'buildings') return 1.5
      return 1.2
    }
    return 0.15
  }, [hoveredLayers])

  // Calculate building color - use custom color if set, otherwise palette
  const buildingColor = useMemo(() => {
    if (hoveredLayers?.includes('buildings')) {
      return '#c6a181' // sand highlight on hover
    }
    return customBuildingColor || palette.building
  }, [hoveredLayers, palette.building, customBuildingColor])

  // Calculate building opacity - more transparent when hovered
  const buildingOpacity = useMemo(() => {
    if (hoveredLayers?.includes('buildings')) {
      return 0.5
    }
    return customBuildingOpacity ?? palette.buildingOpacity
  }, [hoveredLayers, customBuildingOpacity, palette.buildingOpacity])

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Canvas
        orthographic
        camera={{ zoom: 0.8, position: [0, 0, 500], near: -1000, far: 2000 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        {filteredData.roads.length > 0 && (
          <Scene
            roads={filteredData.roads}
            trees={filteredData.trees}
            buildings={filteredData.buildings}
            busStops={filteredData.busStops}
            bicingStations={filteredData.bicingStations}
            trafficViolations={filteredData.trafficViolations}
            parkingZones={filteredData.parkingZones}
            bikeLanes={filteredData.bikeLanes}
            revealed={revealed}
            buildingColor={buildingColor}
            buildingOpacity={buildingOpacity}
            dotGridColor={palette.dotGrid}
            getLayerOpacity={getLayerOpacity}
            sizeMode={sizeMode}
          />
        )}
      </Canvas>
    </div>
  )
}
