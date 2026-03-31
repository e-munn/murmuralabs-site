import { create } from 'zustand';

// Color palette matching the site's warm earth-tone theme
export interface ColorPalette {
  bg: string;
  building: string;
  dotGrid: string;
  buildingOpacity: number;
}

const DEFAULT_PALETTE: ColorPalette = {
  bg: 'transparent',
  building: '#7f5e46',       // driftwood
  dotGrid: '#c6a181',        // sand
  buildingOpacity: 0.6,
};

interface PaletteState {
  palette: ColorPalette;
  customBuildingColor: string | null;
  customBuildingOpacity: number | null;
  setBuildingColor: (color: string | null) => void;
  setBuildingOpacity: (opacity: number | null) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  palette: DEFAULT_PALETTE,
  customBuildingColor: '#c6a181',
  customBuildingOpacity: 0.2,
  setBuildingColor: (color) => set({ customBuildingColor: color }),
  setBuildingOpacity: (opacity) => set({ customBuildingOpacity: opacity }),
}));
