import { defineStore } from "pinia";

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  total_spots: number;
  available_spots: number;
  created_at: string;
}

export interface ParkingSpot {
  id: string;
  identifier: string;
  spot_type: "standard" | "disabled" | "ev" | "vip";
  status: "free" | "occupied" | "reserved";
  location: string;
}

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
