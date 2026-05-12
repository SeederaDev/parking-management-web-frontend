import { defineStore } from "pinia";
import type { TenantSettings } from "~/types";

export const useTenantStore = defineStore("tenant", () => {
  const settings = ref<TenantSettings | null>(null);

  function setSettings(data: TenantSettings) {
    settings.value = data;
  }

  return { settings, setSettings };
});
