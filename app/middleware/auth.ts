export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // Admin-only routes
  if (to.path.startsWith("/dashboard") && !authStore.isAdmin) {
    return navigateTo("/parking");
  }
});
