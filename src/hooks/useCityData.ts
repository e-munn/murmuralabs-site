import { useState, useEffect, useRef } from 'react';
import { useLayerStore } from '../stores/layerStore';

// Import data fetchers
import { fetchOSMData, parseRoads } from '../city/data';
import { fetchBarcelonaTrees } from '../city/Trees';
import { fetchOvertureBuildings, type BuildingData } from '../city/Buildings';
import { type RoadData } from '../city/Roads';
import {
  fetchBusStops,
  fetchBicingStations,
  fetchTrafficViolations,
  fetchParkingZones,
  fetchBikeLanes,
  type BusStopData,
  type BicingStationData,
  type TrafficViolationData,
  type ParkingZoneData,
  type BikeLaneData,
} from '../city/Infrastructure';

export interface CityData {
  roads: RoadData[];
  trees: [number, number, number][];
  buildings: BuildingData[];
  busStops: BusStopData[];
  bicingStations: BicingStationData[];
  trafficViolations: TrafficViolationData[];
  parkingZones: ParkingZoneData[];
  bikeLanes: BikeLaneData[];
}

interface UseCityDataReturn {
  data: CityData;
  isDataLoaded: boolean;
}

export function useCityData(): UseCityDataReturn {
  const [data, setData] = useState<CityData>({
    roads: [],
    trees: [],
    buildings: [],
    busStops: [],
    bicingStations: [],
    trafficViolations: [],
    parkingZones: [],
    bikeLanes: [],
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const hasStartedRef = useRef(false);
  const { startReveal } = useLayerStore();

  // Load all data and start reveal sequence
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    async function loadAllData() {
      try {
        // Fetch all data in parallel
        const [osmData, trees, buildings, busStops, bicingStations, trafficViolations, parkingZones, bikeLanes] =
          await Promise.all([
            fetchOSMData(),
            fetchBarcelonaTrees(),
            fetchOvertureBuildings(),
            fetchBusStops(),
            fetchBicingStations(),
            fetchTrafficViolations(),
            fetchParkingZones(),
            fetchBikeLanes(),
          ]);

        const roads = parseRoads(osmData);

        setData({
          roads,
          trees,
          buildings,
          busStops,
          bicingStations,
          trafficViolations,
          parkingZones,
          bikeLanes,
        });

        setIsDataLoaded(true);

        // Start the reveal sequence now that data is loaded
        startReveal();
      } catch (error) {
        console.error('Error loading city data:', error);
        setIsDataLoaded(true);
        startReveal(); // Start reveal anyway to show what we have
      }
    }

    loadAllData();
  }, [startReveal]);

  return { data, isDataLoaded };
}
