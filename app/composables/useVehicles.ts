import type { Vehicle, VehicleCreate, PaginatedResponse } from "~/types";

export type { Vehicle };

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

  async function createVehicle(payload: VehicleCreate) {
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
