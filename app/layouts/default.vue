<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-indigo-600 text-2xl leading-none">🅿</span>
            <span class="font-bold text-lg text-gray-900 tracking-tight"
              >ParkManager</span
            >
          </NuxtLink>

          <!-- Desktop nav links -->
          <div
            class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600"
          >
            <NuxtLink to="/" class="hover:text-indigo-600 transition-colors"
              >Home</NuxtLink
            >
            <NuxtLink
              to="/parking"
              class="hover:text-indigo-600 transition-colors"
              >Parcheggi a Roma</NuxtLink
            >
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/vehicles"
              class="hover:text-indigo-600 transition-colors"
              >Servizi</NuxtLink
            >
            <NuxtLink to="/" class="hover:text-indigo-600 transition-colors"
              >Chi Siamo</NuxtLink
            >
            <NuxtLink to="/" class="hover:text-indigo-600 transition-colors"
              >Contatti</NuxtLink
            >
          </div>

          <!-- Auth actions -->
          <div class="flex items-center gap-3 text-sm">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink
                v-if="authStore.isAdmin"
                to="/dashboard"
                class="hidden md:inline font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/booking"
                class="hidden md:inline font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Prenotazioni
              </NuxtLink>
              <button
                class="font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-1.5 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm"
                @click="handleLogout"
              >
                Esci
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="hidden md:inline font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Accedi
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Registrati
              </NuxtLink>
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
    <footer class="bg-gray-900 text-gray-400 text-xs py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <span>© 2025 c/o ParkManager — Via Roma, 1 — 00197 Roma, Italy</span>
        <div class="flex items-center gap-5 text-sm">
          <a href="#" class="hover:text-white transition-colors">f</a>
          <a href="#" class="hover:text-white transition-colors">ig</a>
          <a href="#" class="hover:text-white transition-colors">tw</a>
        </div>
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
