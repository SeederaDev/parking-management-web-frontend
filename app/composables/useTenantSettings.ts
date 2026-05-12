import type { TenantSettings, TenantSettingsUpdate } from "~/types";

export const useTenantSettings = () => {
  const api = useApi();
  const store = useTenantStore();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const saving = ref(false);

  async function fetchSettings(): Promise<TenantSettings | null> {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<TenantSettings>("/tenants/settings/");
      store.setSettings(data);
      return data;
    } catch {
      error.value = "Impossibile caricare le impostazioni.";
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateSettings(
    payload: TenantSettingsUpdate,
  ): Promise<TenantSettings | null> {
    saving.value = true;
    error.value = null;
    try {
      const data = await api<TenantSettings>("/tenants/settings/", {
        method: "PATCH",
        body: payload,
      });
      store.setSettings(data);
      return data;
    } catch (err: unknown) {
      error.value = extractApiError(
        err,
        "Impossibile salvare le impostazioni.",
      );
      return null;
    } finally {
      saving.value = false;
    }
  }

  return {
    settings: computed(() => store.settings),
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
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
