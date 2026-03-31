import { create } from 'zustand';

export type SizeMode = 'small' | 'medium' | 'large';

interface SizeState {
  mode: SizeMode;
  setMode: (mode: SizeMode) => void;
}

// Radius in meters for data filtering (circular region from center)
export const SIZE_RADII: Record<SizeMode, number> = {
  small: 200,   // ~2 blocks
  medium: 400,  // ~4 blocks
  large: 665,   // Full data (current)
};

// Zoom levels for each size mode
export const SIZE_ZOOMS: Record<SizeMode, number> = {
  small: 2.0,   // Zoomed in
  medium: 1.2,  // Medium zoom
  large: 0.7,   // Full view (zoomed out a bit)
};

// Grid extents for each size mode (slightly larger than radius)
export const SIZE_EXTENTS: Record<SizeMode, number> = {
  small: 300,   // Match small radius
  medium: 600,  // Match medium radius
  large: 1000,  // Match large radius
};

export const useSizeStore = create<SizeState>((set) => ({
  mode: 'medium', // Default to medium (large disabled for performance)
  setMode: (mode) => set({ mode }),
}));
