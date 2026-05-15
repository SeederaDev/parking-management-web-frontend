<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-15">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <img
              src="/logo.avif"
              alt="Palmieri &amp; Treglia"
              class="h-9 w-auto"
            />
            <span
              class="font-semibold text-sm text-gray-900 tracking-tight hidden sm:block"
              >Palmieri &amp; Treglia</span
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
              >Parcheggi</NuxtLink
            >
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/vehicles"
              class="hover:text-gray-900 transition-colors"
              >Servizi</NuxtLink
            >
            <NuxtLink
              to="/chi-siamo"
              class="hover:text-gray-900 transition-colors"
              >Chi Siamo</NuxtLink
            >
            <NuxtLink
              to="/contatti"
              class="hover:text-gray-900 transition-colors"
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
                class="font-medium bg-[#1B2A6B] text-white px-4 py-1.5 rounded-lg hover:bg-[#0E1840] transition-colors text-sm"
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
          <img
            src="/logo.avif"
            alt="Palmieri &amp; Treglia"
            class="h-6 w-auto"
          />
          <span class="font-medium text-gray-600">Palmieri &amp; Treglia</span>
        </div>
        <span
          >© {{ new Date().getFullYear() }} Palmieri &amp; Treglia s.r.l. Tutti
          i diritti riservati.</span
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
