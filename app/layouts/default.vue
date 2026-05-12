<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-15">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <div
              class="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <span class="font-semibold text-sm text-gray-900 tracking-tight"
              >ParkManager</span
            >
          </NuxtLink>

          <!-- Desktop nav links -->
          <div
            class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500"
          >
            <NuxtLink to="/" class="hover:text-gray-900 transition-colors"
              >Home</NuxtLink
            >
            <NuxtLink
              to="/parking"
              class="hover:text-gray-900 transition-colors"
              >Parcheggi a Roma</NuxtLink
            >
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/vehicles"
              class="hover:text-gray-900 transition-colors"
              >Servizi</NuxtLink
            >
            <NuxtLink to="/" class="hover:text-gray-900 transition-colors"
              >Chi Siamo</NuxtLink
            >
            <NuxtLink to="/" class="hover:text-gray-900 transition-colors"
              >Contatti</NuxtLink
            >
          </div>

          <!-- Auth actions -->
          <div class="flex items-center gap-2 text-sm">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink
                v-if="authStore.isAdmin"
                to="/dashboard"
                class="hidden md:inline font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
                >Dashboard</NuxtLink
              >
              <NuxtLink
                to="/booking"
                class="hidden md:inline font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
                >Prenotazioni</NuxtLink
              >
              <button
                class="font-medium text-gray-600 border border-gray-200 rounded-lg px-3.5 py-1.5 hover:border-gray-300 hover:text-gray-900 transition-colors"
                @click="handleLogout"
              >
                Esci
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="hidden md:inline font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
                >Accedi</NuxtLink
              >
              <NuxtLink
                to="/register"
                class="font-medium bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >Registrati</NuxtLink
              >
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-gray-100 bg-white text-gray-400 text-xs py-6 px-6"
    >
      <div
        class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-5 h-5 bg-blue-600 rounded flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <span class="font-medium text-gray-600">ParkManager</span>
          <span>— Via Roma, 1 — Roma, Italy</span>
        </div>
        <span
          >© {{ new Date().getFullYear() }} ParkManager. Tutti i diritti
          riservati.</span
        >
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { logout } = useAuth();

async function handleLogout() {
  await logout();
}
</script>
