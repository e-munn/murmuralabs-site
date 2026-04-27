// Mapbox style imports — kept in sync with ../../../murmur/src/map/MapView.tsx
// Each style wraps mapbox://styles/mapbox/standard with the same warm theme +
// label-off + custom color overrides used in the murmur app.

import type { StyleSpecification } from "mapbox-gl";

const NO_LABELS = {
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  showPlaceLabels: false,
  showRoadLabels: false,
};

export function standardDayMinimal(): StyleSpecification {
  return {
    version: 8,
    imports: [
      {
        id: "basemap",
        url: "mapbox://styles/mapbox/standard",
        config: {
          theme: "warm",
          lightPreset: "dawn",
          ...NO_LABELS,
          colorLand: "hsl(30, 24%, 93%)",
          colorCommercial: "hsla(0, 38%, 55%, 0.00)",
          colorEducation: "hsl(35, 25%, 88%)",
          colorMedical: "hsl(35, 25%, 88%)",
          colorIndustrial: "hsl(30, 10%, 83%)",
          colorGreenspace: "hsl(148, 10%, 77%)",
          colorWater: "hsl(210, 22%, 58%)",
          colorRoads: "hsl(30, 15%, 82%)",
          colorMotorways: "hsl(30, 15%, 79%)",
          colorTrunks: "hsl(30, 15%, 80%)",
          show3dObjects: true,
          showPedestrianRoads: true,
          showAdminBoundaries: false,
        },
      },
    ],
    sources: {},
    layers: [],
  } as unknown as StyleSpecification;
}

export function standardDawnMinimal(): StyleSpecification {
  return {
    version: 8,
    imports: [
      {
        id: "basemap",
        url: "mapbox://styles/mapbox/standard",
        config: {
          theme: "warm",
          lightPreset: "dawn",
          ...NO_LABELS,
          colorLand: "hsl(30, 35%, 86%)",
          colorBuildings: "hsl(30, 22%, 82%)",
          colorCommercial: "hsla(0, 38%, 55%, 0.00)",
          colorEducation: "hsl(35, 25%, 88%)",
          colorMedical: "hsl(35, 25%, 88%)",
          colorIndustrial: "hsl(30, 10%, 83%)",
          colorGreenspace: "hsl(148, 10%, 77%)",
          colorWater: "hsl(210, 22%, 58%)",
          colorRoads: "hsl(30, 15%, 75%)",
          colorMotorways: "hsl(30, 15%, 72%)",
          colorTrunks: "hsl(30, 15%, 73%)",
          show3dObjects: true,
          showPedestrianRoads: true,
          showAdminBoundaries: false,
        },
      },
    ],
    sources: {},
    layers: [],
  } as unknown as StyleSpecification;
}

export function standardDuskMinimal(): StyleSpecification {
  return {
    version: 8,
    imports: [
      {
        id: "basemap",
        url: "mapbox://styles/mapbox/standard",
        config: {
          theme: "warm",
          lightPreset: "dusk",
          ...NO_LABELS,
          colorCommercial: "hsla(0, 38%, 55%, 0.00)",
          colorEducation: "hsl(30, 25%, 75%)",
          colorMedical: "hsl(30, 25%, 75%)",
          colorIndustrial: "hsl(25, 10%, 68%)",
          colorGreenspace: "hsl(148, 15%, 55%)",
          show3dObjects: true,
          showPedestrianRoads: true,
          showAdminBoundaries: false,
        },
      },
    ],
    sources: {},
    layers: [],
  } as unknown as StyleSpecification;
}

export function standardNightMinimal(): StyleSpecification {
  return {
    version: 8,
    imports: [
      {
        id: "basemap",
        url: "mapbox://styles/mapbox/standard",
        config: {
          theme: "warm",
          lightPreset: "night",
          ...NO_LABELS,
          colorLand: "hsl(251, 9%, 25%)",
          colorBuildings: "hsl(228, 4%, 54%)",
          colorCommercial: "hsla(0, 38%, 55%, 0.00)",
          colorEducation: "hsl(220, 5%, 18%)",
          colorMedical: "hsl(220, 5%, 18%)",
          colorIndustrial: "hsl(0, 0%, 38%)",
          colorGreenspace: "hsl(152, 47%, 25%)",
          colorRoads: "hsla(220, 5%, 35%, 0.5)",
          colorMotorways: "hsla(220, 5%, 40%, 0.5)",
          colorTrunks: "hsla(220, 5%, 37%, 0.5)",
          colorWater: "hsl(208, 23%, 68%)",
          show3dObjects: true,
          showPedestrianRoads: false,
          showAdminBoundaries: false,
        },
      },
    ],
    sources: {},
    layers: [],
  } as unknown as StyleSpecification;
}
