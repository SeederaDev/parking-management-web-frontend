/**
 * Decode a JWT and return its expiry timestamp (seconds), or 0 on failure.
 */
function jwtExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]!));
    return typeof payload.exp === "number" ? payload.exp : 0;
  } catch {
    return 0;
  }
}

/** True when the access token expires within the next 30 seconds. */
function isExpiredOrExpiringSoon(token: string | null): boolean {
  if (!token) return true;
  return jwtExpiry(token) - Date.now() / 1000 < 30;
}

let _refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt a silent token refresh. Returns true on success.
 * Coalesces concurrent calls into a single request.
 */
async function silentRefresh(
  authStore: ReturnType<typeof useAuthStore>,
  apiBase: string,
): Promise<boolean> {
  if (!authStore.refreshToken) return false;

  // Coalesce concurrent refresh calls
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const data = await $fetch<{ access: string; refresh?: string }>(
        "/auth/refresh/",
        {
          baseURL: apiBase,
          method: "POST",
          body: { refresh: authStore.refreshToken },
        },
      );
      authStore.accessToken = data.access;
      if (data.refresh) authStore.refreshToken = data.refresh;
      return true;
    } catch {
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

/**
 * useApi — returns a $fetch instance pre-configured with:
 *   - base URL from runtimeConfig
 *   - Authorization header injected from auth store
 *   - Proactive silent refresh when the access token is close to expiry
 *   - 401 → attempt one silent refresh + retry, then logout
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();
  const apiBase = config.public.apiBase as string;

  return $fetch.create({
    baseURL: apiBase,

    async onRequest({ options }) {
      // Proactively refresh if the token is expired or expiring soon
      if (
        authStore.refreshToken &&
        isExpiredOrExpiringSoon(authStore.accessToken)
      ) {
        await silentRefresh(authStore, apiBase);
      }

      if (authStore.accessToken) {
        options.headers = {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${authStore.accessToken}`,
        };
      }
    },

    async onResponseError({ request, response, options }) {
      if (response.status !== 401) return;

      // Try a silent refresh once
      const refreshed = await silentRefresh(authStore, apiBase);
      if (!refreshed) {
        authStore.clearSession();
        await router.push("/login");
        return;
      }

      // Retry the original request with the new token
      await $fetch(request, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
    },
  });
};
