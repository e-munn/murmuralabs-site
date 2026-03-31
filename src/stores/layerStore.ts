import { create } from 'zustand';

// Layer keys in reveal order (left to right in legend)
export type LayerKey =
  | 'grid'
  | 'roads'
  | 'trees'
  | 'parking'
  | 'bikeLanes'
  | 'busStops'
  | 'bicingStations'
  | 'trafficViolations'
  | 'flowParticles'
  | 'buildings';

// Reveal sequence - fast staged reveal for immediate visual impact
// Total time: ~6 seconds
export const REVEAL_SEQUENCE: { layers: LayerKey[]; delay: number }[] = [
  { layers: ['grid', 'roads'], delay: 0 },           // Roads - immediate
  { layers: ['trees'], delay: 500 },                 // Trees - 0.5s
  { layers: ['parking', 'bikeLanes'], delay: 1000 }, // Data start - 1s
  { layers: ['busStops'], delay: 1800 },             // Data sub 1 - 1.8s
  { layers: ['bicingStations'], delay: 2600 },       // Data sub 2 - 2.6s
  { layers: ['trafficViolations'], delay: 3400 },    // Data sub 3 - 3.4s
  { layers: ['flowParticles'], delay: 4200 },        // Data sub 4 - 4.2s
  { layers: ['buildings'], delay: 5800 },            // Buildings - 5.8s (more delay after data)
];

interface LayerState {
  // Which layers are revealed (visible)
  revealed: Record<LayerKey, boolean>;
  // When the reveal sequence started (null if not started)
  startTime: number | null;
  // Which layers are currently hovered (for highlight effect)
  hoveredLayers: LayerKey[] | null;
  // Start the reveal sequence
  startReveal: () => void;
  // Check if a layer is revealed
  isRevealed: (layer: LayerKey) => boolean;
  // Get start time
  getStartTime: () => number | null;
  // Set hovered layers (null = no hover, show all at full opacity)
  setHoveredLayers: (layers: LayerKey[] | null) => void;
  // Check if a layer should be highlighted (either no hover or is in hovered list)
  isHighlighted: (layer: LayerKey) => boolean;
  // Reset all
  reset: () => void;
  // Check if all layers are revealed
  isComplete: () => boolean;
}

const initialRevealed: Record<LayerKey, boolean> = {
  grid: false,
  roads: false,
  trees: false,
  buildings: false,
  parking: false,
  bikeLanes: false,
  busStops: false,
  bicingStations: false,
  trafficViolations: false,
  flowParticles: false,
};

export const useLayerStore = create<LayerState>((set, get) => ({
  revealed: { ...initialRevealed },
  startTime: null,
  hoveredLayers: null,

  startReveal: () => {
    const now = Date.now();
    set({ startTime: now });

    // Schedule each group reveal
    REVEAL_SEQUENCE.forEach(({ layers, delay }) => {
      setTimeout(() => {
        set((state) => {
          const newRevealed = { ...state.revealed };
          layers.forEach((layer) => {
            newRevealed[layer] = true;
          });
          return { revealed: newRevealed };
        });
      }, delay);
    });
  },

  isRevealed: (layer) => get().revealed[layer],

  getStartTime: () => get().startTime,

  setHoveredLayers: (layers) => set({ hoveredLayers: layers }),

  isHighlighted: (layer) => {
    const { hoveredLayers } = get();
    // If nothing is hovered, everything is highlighted
    if (hoveredLayers === null) return true;
    // Otherwise, only hovered layers are highlighted
    return hoveredLayers.includes(layer);
  },

  reset: () => set({
    revealed: { ...initialRevealed },
    startTime: null,
    hoveredLayers: null,
  }),

  isComplete: () => {
    const { revealed } = get();
    return Object.values(revealed).every(Boolean);
  },
}));
