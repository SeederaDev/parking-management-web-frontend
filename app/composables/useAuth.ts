import type { LoginPayload, RegisterPayload, AuthResponse } from "~/types";

export const useAuth = () => {
  const api = useApi();
  const authStore = useAuthStore();
  const router = useRouter();

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<AuthResponse>("/auth/login/", {
        method: "POST",
        body: payload,
      });
      authStore.setSession(data);
      await router.push(authStore.isAdmin ? "/dashboard" : "/parcheggio");
    } catch (err: unknown) {
      error.value = extractError(err, "Credenziali non valide.");
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload & { recaptcha_token?: string }) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<AuthResponse>("/auth/register/", {
        method: "POST",
        body: payload,
      });
      authStore.setSession(data);
      await router.push("/parcheggio");
    } catch (err: unknown) {
      error.value = extractError(err, "Registrazione non riuscita.");
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await api("/auth/logout/", {
        method: "POST",
        body: { refresh: authStore.refreshToken },
      });
    } finally {
      authStore.clearSession();
      await router.push("/login");
    }
  }

  async function requestPasswordReset(email: string): Promise<string | null> {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<{ detail: string }>("/auth/password-reset/", {
        method: "POST",
        body: { email },
      });
      return data.detail;
    } catch (err: unknown) {
      error.value = extractError(err, "Errore nell'invio della email.");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function confirmPasswordReset(uid: string, token: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await api("/auth/password-reset/confirm/", {
        method: "POST",
        body: { uid, token, password },
      });
      return true;
    } catch (err: unknown) {
      error.value = extractError(err, "Link scaduto o non valido.");
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { login, register, logout, requestPasswordReset, confirmPasswordReset, loading, error };
};

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data: Record<string, unknown> }).data;
    if (typeof data.error === "string") return data.error;
    if (typeof data.detail === "string") return data.detail;
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return fallback;
}
