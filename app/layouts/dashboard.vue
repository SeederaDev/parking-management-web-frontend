<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Brand -->
      <div class="flex items-center gap-2 h-16 px-6 border-b border-gray-100">
        <span class="text-indigo-600 text-2xl leading-none">🅿</span>
        <span class="font-bold text-lg text-gray-900 tracking-tight"
          >ParkManager</span
        >
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <AdminNavItem
          to="/dashboard"
          icon="📊"
          label="Panoramica"
          :exact="true"
        />
        <AdminNavItem to="/dashboard/bookings" icon="📋" label="Prenotazioni" />
        <AdminNavItem to="/dashboard/calendar" icon="📅" label="Calendario" />
        <AdminNavItem to="/dashboard/customers" icon="👥" label="Clienti" />
        <AdminNavItem
          to="/dashboard/manual-booking"
          icon="✏️"
          label="Prenotazione Manuale"
        />

        <div class="pt-3 pb-1 px-3">
          <p
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            Gestione
          </p>
        </div>

        <AdminNavItem
          to="/dashboard/operating-hours"
          icon="🕐"
          label="Orari di Apertura"
        />
        <AdminNavItem
          to="/dashboard/closures"
          icon="🚫"
          label="Periodi di Chiusura"
        />
        <AdminNavItem to="/dashboard/settings" icon="⚙️" label="Impostazioni" />
      </nav>

      <!-- User footer -->
      <div class="border-t border-gray-100 p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
          <button
            class="text-gray-400 hover:text-red-500 transition-colors"
            title="Esci"
            @click="handleLogout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Backdrop (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-20 bg-white border-b border-gray-100 h-16 flex items-center px-6 gap-4"
      >
        <button
          class="lg:hidden text-gray-500 hover:text-indigo-600"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 class="text-base font-semibold text-gray-800">{{ pageTitle }}</h1>
        <div class="ml-auto flex items-center gap-3 text-sm text-gray-500">
          <NuxtLink
            to="/"
            class="hover:text-indigo-600 transition-colors text-sm"
            >← Sito</NuxtLink
          >
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();
const { logout } = useAuth();

const sidebarOpen = ref(false);

const userInitials = computed(() => {
  const u = authStore.user;
  if (!u) return "?";
  return `${u.first_name[0] ?? ""}${u.last_name[0] ?? ""}`.toUpperCase();
});

const pageTitles: Record<string, string> = {
  "/dashboard": "Panoramica",
  "/dashboard/bookings": "Prenotazioni",
  "/dashboard/calendar": "Calendario",
  "/dashboard/customers": "Clienti",
  "/dashboard/manual-booking": "Prenotazione Manuale",
  "/dashboard/operating-hours": "Orari di Apertura",
  "/dashboard/closures": "Periodi di Chiusura",
  "/dashboard/settings": "Impostazioni",
};

const pageTitle = computed(() => pageTitles[route.path] ?? "Dashboard");

async function handleLogout() {
  await logout();
}

// Close sidebar on route change (mobile)
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  }
);
</script>
