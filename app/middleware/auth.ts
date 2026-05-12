export default defineNuxtRouteMiddleware((to) => {
  // Skip on SSR — localStorage isn't available server-side.
  // Client-side navigation is still protected.
  if (import.meta.server) return;

  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
