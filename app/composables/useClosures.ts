import type {
  ClosurePeriod,
  ClosurePeriodCreate,
  PaginatedResponse,
} from "~/types";

export const useClosures = () => {
  const api = useApi();

  const closures = ref<ClosurePeriod[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchClosures(locationId?: string) {
    loading.value = true;
    error.value = null;
    try {
      const params = locationId ? `?location_id=${locationId}` : "";
      const data = await api<PaginatedResponse<ClosurePeriod>>(
        `/parking/closures/${params}`,
      );
      closures.value = data.results;
    } catch {
      error.value = "Impossibile caricare i periodi di chiusura.";
    } finally {
      loading.value = false;
    }
  }

  async function createClosure(
    payload: ClosurePeriodCreate,
  ): Promise<ClosurePeriod | null> {
    try {
      const item = await api<ClosurePeriod>("/parking/closures/", {
        method: "POST",
        body: payload,
      });
      closures.value.unshift(item);
      return item;
    } catch (err: unknown) {
      error.value = extractApiError(err, "Impossibile creare la chiusura.");
      return null;
    }
  }

  async function deleteClosure(id: string): Promise<boolean> {
    try {
      await api(`/parking/closures/${id}/`, { method: "DELETE" });
      closures.value = closures.value.filter((c) => c.id !== id);
      return true;
    } catch {
      error.value = "Impossibile eliminare la chiusura.";
      return false;
    }
  }

  return {
    closures,
    loading,
    error,
    fetchClosures,
    createClosure,
    deleteClosure,
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
