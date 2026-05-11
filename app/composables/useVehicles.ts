export interface Vehicle {
  id: string;
  name: string;
  model: string;
  description: string;
  price_per_day: string;
  is_available: boolean;
  images: Array<{ id: string; image: string; is_primary: boolean }>;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export const useVehicles = () => {
  const api = useApi();

  const vehicles = ref<Vehicle[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchVehicles(availableOnly = false) {
    loading.value = true;
    error.value = null;
    try {
      const params = availableOnly ? "?available=true" : "";
      const data = await api<PaginatedResponse<Vehicle>>(`/vehicles/${params}`);
      vehicles.value = data.results;
    } catch {
      error.value = "Failed to load vehicles.";
    } finally {
      loading.value = false;
    }
  }

  async function createVehicle(
    payload: Omit<Vehicle, "id" | "images" | "created_at" | "updated_at">,
  ) {
    return api<Vehicle>("/vehicles/", { method: "POST", body: payload });
  }

  async function updateVehicle(id: string, payload: Partial<Vehicle>) {
    return api<Vehicle>(`/vehicles/${id}/`, { method: "PATCH", body: payload });
  }

  async function deleteVehicle(id: string) {
    return api(`/vehicles/${id}/`, { method: "DELETE" });
  }

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
