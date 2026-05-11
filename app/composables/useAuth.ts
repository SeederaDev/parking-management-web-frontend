import type { User } from "~/stores/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  tenant_slug: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

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
      await router.push(authStore.isAdmin ? "/dashboard" : "/parking");
    } catch (err: unknown) {
      error.value = extractError(err, "Invalid credentials.");
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      const data = await api<AuthResponse>("/auth/register/", {
        method: "POST",
        body: payload,
      });
      authStore.setSession(data);
      await router.push("/parking");
    } catch (err: unknown) {
      error.value = extractError(err, "Registration failed.");
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

  return { login, register, logout, loading, error };
};

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data: Record<string, unknown> }).data;
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return fallback;
}
