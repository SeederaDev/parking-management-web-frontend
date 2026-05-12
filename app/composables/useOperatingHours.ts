import type {
  OperatingHours,
  OperatingHoursCreate,
  OperatingHoursUpdate,
  PaginatedResponse,
} from "~/types";

export const useOperatingHours = () => {
  const api = useApi();

  const hours = ref<OperatingHours[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchHours(locationId?: string) {
    loading.value = true;
    error.value = null;
    try {
      const params = locationId ? `?location_id=${locationId}` : "";
      const data = await api<PaginatedResponse<OperatingHours>>(
        `/parking/operating-hours/${params}`,
      );
      hours.value = data.results;
    } catch {
      error.value = "Impossibile caricare gli orari.";
    } finally {
      loading.value = false;
    }
  }

  async function createHours(
    payload: OperatingHoursCreate,
  ): Promise<OperatingHours | null> {
    try {
      const item = await api<OperatingHours>("/parking/operating-hours/", {
        method: "POST",
        body: payload,
      });
      hours.value.push(item);
      return item;
    } catch (err: unknown) {
      error.value = extractApiError(err, "Impossibile creare l'orario.");
      return null;
    }
  }

  async function updateHours(
    id: string,
    payload: OperatingHoursUpdate,
  ): Promise<OperatingHours | null> {
    try {
      const item = await api<OperatingHours>(
        `/parking/operating-hours/${id}/`,
        { method: "PATCH", body: payload },
      );
      const idx = hours.value.findIndex((h) => h.id === id);
      if (idx >= 0) hours.value[idx] = item;
      return item;
    } catch (err: unknown) {
      error.value = extractApiError(err, "Impossibile aggiornare l'orario.");
      return null;
    }
  }

  async function deleteHours(id: string): Promise<boolean> {
    try {
      await api(`/parking/operating-hours/${id}/`, { method: "DELETE" });
      hours.value = hours.value.filter((h) => h.id !== id);
      return true;
    } catch {
      error.value = "Impossibile eliminare l'orario.";
      return false;
    }
  }

  return {
    hours,
    loading,
    error,
    fetchHours,
    createHours,
    updateHours,
    deleteHours,
  };
};

function extractApiError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data: Record<string, unknown> }).data;
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return fallback;
}
