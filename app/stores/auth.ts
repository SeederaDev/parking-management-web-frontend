import { defineStore } from "pinia";
import type { User } from "~/types";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!accessToken.value);
    const isAdmin = computed(() => user.value?.role === "admin");

    function setSession(data: { access: string; refresh: string; user: User }) {
      accessToken.value = data.access;
      refreshToken.value = data.refresh;
      user.value = data.user;
    }

    function clearSession() {
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
    }

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      isAdmin,
      setSession,
      clearSession,
    };
  },
  { persist: import.meta.client },
);
