import { defineStore } from "pinia";
import type { ParkingLocation, ParkingSpot } from "~/types";

export type { ParkingLocation, ParkingSpot };

export const useParkingStore = defineStore("parking", () => {
  const locations = ref<ParkingLocation[]>([]);
  const availableSpots = ref<ParkingSpot[]>([]);
  const selectedLocation = ref<ParkingLocation | null>(null);
  const loading = ref(false);

  function setLocations(data: ParkingLocation[]) {
    locations.value = data;
  }

  function setAvailableSpots(data: ParkingSpot[]) {
    availableSpots.value = data;
  }

  function selectLocation(location: ParkingLocation | null) {
    selectedLocation.value = location;
  }

  return {
    locations,
    availableSpots,
    selectedLocation,
    loading,
    setLocations,
    setAvailableSpots,
    selectLocation,
  };
});
