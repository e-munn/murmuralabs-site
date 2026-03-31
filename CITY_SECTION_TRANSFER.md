# CitySection Transfer Guide

> Transfer the Barcelona 3D city visualization + icon bar legend from `aretian-home` to `murmuralabs/site`.

## What It Is

A full-screen section showing an isometric Three.js scene of Barcelona with:
- Dot grid, roads, trees, buildings, parking, bike lanes
- Animated data markers (bus stops, bicing stations, traffic violations, traffic flow particles)
- Progressive reveal sequence (~6s staged animation)
- Vertical icon bar legend (right side) with hover-to-highlight, circular progress rings, magnet effect, typing labels

## Dependencies to Install

The murmuralabs site already has `three`, `motion`, and `react`. Add:

```bash
npm install @react-three/fiber @react-three/drei zustand lodash @turf/turf proj4 lucide-react
npm install -D @types/lodash @types/proj4
```

## Files to Copy

All paths relative to the aretian-home repo root.

### Components (copy to `src/`)

| Source | Destination | Notes |
|--------|-------------|-------|
| `components/CityScene.tsx` | `src/city/CityScene.tsx` | Main Canvas + Scene |
| `components/city/LoadingLegend.tsx` | `src/city/LoadingLegend.tsx` | Icon bar legend |
| `components/city/Grid.tsx` | `src/city/Grid.tsx` | Dot grid layer |
| `components/city/Roads.tsx` | `src/city/Roads.tsx` | Roads + flow particles |
| `components/city/Trees.tsx` | `src/city/Trees.tsx` | Instanced palm trees |
| `components/city/Buildings.tsx` | `src/city/Buildings.tsx` | 3D buildings |
| `components/city/Infrastructure.tsx` | `src/city/Infrastructure.tsx` | Parking, bike lanes, data fetchers |
| `components/city/Markers.tsx` | `src/city/Markers.tsx` | Bus/bicing/violation markers |
| `components/city/LayerAnimations.tsx` | `src/city/LayerAnimations.tsx` | FadeInLayer wrapper |
| `components/city/data.ts` | `src/city/data.ts` | Data fetching + coordinate projection |
| `components/city/osm-utils.ts` | `src/city/osm-utils.ts` | OSM utilities |
| `components/city/models.tsx` | `src/city/models.tsx` | Three.js geometry helpers |
| `components/Magnet.jsx` | `src/city/Magnet.jsx` | Mouse magnet effect |
| `components/TextType.jsx` | `src/city/TextType.jsx` | Typing animation |
| `components/TextType.css` | `src/city/TextType.css` | Typing animation styles |

### Stores (copy to `src/stores/`)

| Source | Destination |
|--------|-------------|
| `stores/layerStore.ts` | `src/stores/layerStore.ts` |
| `stores/paletteStore.ts` | `src/stores/paletteStore.ts` |
| `stores/sizeStore.ts` | `src/stores/sizeStore.ts` |

### Hook (copy to `src/hooks/`)

| Source | Destination |
|--------|-------------|
| `hooks/useCityData.ts` | `src/hooks/useCityData.ts` |

### Data Files (copy to `public/data/`)

```
public/data/barcelona/bus-stops.json
public/data/barcelona/bicing-stations.json
public/data/barcelona/traffic-violations.json
public/data/barcelona/parking-zones.json
public/data/perimeter/barcelona-roads.json
public/data/perimeter/barcelona-buildings.json
public/data/perimeter/barcelona-trees.json
public/data/perimeter/barcelona-roads-custom.json
public/data/perimeter/barcelona-buildings-custom.json
public/data/perimeter/barcelona-trees-custom.json
public/data/perimeter/custom-perimeter-shrunk.json
public/data/perimeter/custom-perimeter.json
```

## Adaptations Required

### 1. Remove Next.js-isms

All copied files use `'use client'` directives and Next.js path aliases (`@/`). Fix:

- **Remove** all `'use client'` lines (Vite doesn't need them)
- **Replace** `@/` imports with relative paths, e.g.:
  - `@/stores/layerStore` → `../stores/layerStore`
  - `@/components/city/data` → `./data`
  - `@/hooks/useCityData` → `../hooks/useCityData`

Or configure a Vite alias in `vite.config.ts`:
```ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

### 2. LoadingLegend.tsx — Remove Next.js Router

The `useRouter` from `next/navigation` is used only for the "Explore" button. Replace:

```diff
- import { useRouter } from 'next/navigation';
  // ...
- const router = useRouter();
- const handleExplore = () => { router.push('/explore'); };
+ const handleExplore = () => { window.location.href = '/explore'; };
```

Or remove the explore button entirely if not needed.

### 3. CitySection Wrapper — Remove `next/dynamic`

The original uses `next/dynamic` for SSR-disabled lazy loading. In Vite (client-only), just use `React.lazy`:

```tsx
import { Suspense, lazy } from 'react';
import { LoadingLegend } from './city/LoadingLegend';

const CityScene = lazy(() => import('./city/CityScene'));

const CityLoadingFallback = (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-white/40">
      <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Loading city visualization...</span>
    </div>
  </div>
);

export function CitySection() {
  return (
    <section id="city" className="relative w-full h-screen overflow-hidden">
      <Suspense fallback={CityLoadingFallback}>
        <CityScene />
      </Suspense>
      <LoadingLegend />
    </section>
  );
}
```

### 4. AsyncBoundary — Not Needed

The `AsyncBoundary` component wraps Suspense + ErrorBoundary. Replace with a plain `<Suspense>` as shown above, or copy `components/ui/AsyncBoundary.tsx` if you want error boundary support.

### 5. useCityData Hook — Remove `'use client'`

Just remove the `'use client'` directive. Everything else works in plain React.

### 6. framer-motion Import Path

The aretian-home project imports from `motion/react`:
```ts
import { motion, AnimatePresence } from 'motion/react';
```
The murmuralabs site already has `motion@12.38.0` which supports this import path. No change needed.

### 7. Tailwind Classes

Both projects use Tailwind. The city section uses standard utility classes (`absolute`, `z-50`, `flex`, `rounded-full`, `backdrop-blur-sm`, etc.). These should work as-is with Tailwind 4 in the murmuralabs site.

## Integration in App.tsx

Add the section to the murmuralabs `App.tsx`:

```tsx
import { CitySection } from './city/CitySection'; // or wherever you place it

// In your JSX, add between existing sections:
<CitySection />
```

## Architecture Overview

```
CitySection (wrapper)
├── CityScene (Canvas + orthographic camera)
│   └── Scene (group with isometric rotation)
│       ├── FadeInLayer → DotGrid
│       ├── FadeInLayer → Roads
│       ├── FadeInLayer → ParkingZones
│       ├── FadeInLayer → BikeLanes
│       ├── FadeInLayer → InstancedPalmTrees
│       ├── FadeInLayer → FlowParticles
│       ├── FadeInLayer → DetailedBuildings
│       ├── BusStopMarkers
│       ├── BicingMarkers
│       └── TrafficViolationMarkers
│
├── LoadingLegend (icon bar overlay)
│   ├── LoadingIcon (Roads & Grid)
│   ├── LoadingIcon (Urban Trees)
│   ├── Data group (orange border)
│   │   ├── LoadingIcon (Bus Stops)
│   │   ├── LoadingIcon (Bicing Stations)
│   │   ├── LoadingIcon (Traffic Violations)
│   │   └── LoadingIcon (Traffic Flow)
│   ├── LoadingIcon (3D Buildings)
│   └── Explore button
│
└── Zustand Stores
    ├── layerStore (reveal sequence, hover state)
    ├── paletteStore (colors, building opacity)
    └── sizeStore (viewport size modes, zoom levels)
```

## Data Flow

1. `useCityData` hook fetches all JSON data files in parallel
2. When loaded, calls `layerStore.startReveal()` which schedules timed reveals
3. `CityScene` reads revealed state + hover state from `layerStore`
4. `LoadingLegend` shows progress rings synced to reveal timing, sets hover state on icon interaction
5. Scene layers dim/brighten based on which legend icon is hovered
