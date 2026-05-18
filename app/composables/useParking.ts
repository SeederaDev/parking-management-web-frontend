import type {
  ParkingLocation,
  ParkingSpot,
  AvailabilityQuery,
  PaginatedResponse,
} from "~/types";

export const useParking = () => {
  const api = useApi();
  const store = useParkingStore();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const spots = ref<ParkingSpot[]>([]);

  async function fetchSpots(locationId?: string) {
    loading.value = true;
    error.value = null;
    try {
      const params = locationId ? `?location=${locationId}` : "";
      const data = await api<PaginatedResponse<ParkingSpot>>(`/parking/spots/${params}`);
      spots.value = data.results;
      return data.results;
    } catch {
      error.value = "Impossibile caricare i posti.";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchLocations() {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<PaginatedResponse<ParkingLocation>>(
        "/parking/locations/",
      );
      store.setLocations(data.results);
    } catch (err: unknown) {
      error.value = "Failed to load parking locations.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchAvailability(query: AvailabilityQuery) {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(query).toString();
      const data = await api<ParkingSpot[]>(`/parking/availability/?${params}`);
      store.setAvailableSpots(data);
      return data;
    } catch (err: unknown) {
      error.value = "Failed to check availability.";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Admin: CRUD for locations
  async function createLocation(
    payload: Omit<ParkingLocation, "id" | "available_spots" | "created_at">,
  ) {
    return api<ParkingLocation>("/parking/locations/", {
      method: "POST",
      body: payload,
    });
  }

  async function updateLocation(id: string, payload: Partial<ParkingLocation>) {
    return api<ParkingLocation>(`/parking/locations/${id}/`, {
      method: "PATCH",
      body: payload,
    });
  }

  async function deleteLocation(id: string) {
    return api(`/parking/locations/${id}/`, { method: "DELETE" });
  }

  // Admin: CRUD for spots
  async function createSpot(payload: Omit<ParkingSpot, "id">) {
    return api<ParkingSpot>("/parking/spots/", {
      method: "POST",
      body: payload,
    });
  }

  async function updateSpot(id: string, payload: Partial<ParkingSpot>) {
    return api<ParkingSpot>(`/parking/spots/${id}/`, {
      method: "PATCH",
      body: payload,
    });
  }

  async function deleteSpot(id: string) {
    return api(`/parking/spots/${id}/`, { method: "DELETE" });
  }

  return {
    loading,
    error,
    spots,
    fetchLocations,
    fetchAvailability,
    fetchSpots,
    createLocation,
    updateLocation,
    deleteLocation,
    createSpot,
    updateSpot,
    deleteSpot,
  };
};
