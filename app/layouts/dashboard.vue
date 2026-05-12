<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-60 bg-slate-900 flex flex-col transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Brand -->
      <div
        class="flex items-center gap-2.5 h-14 px-5 border-b border-white/5 shrink-0"
      >
        <div
          class="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center shrink-0"
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
        <span class="text-white font-semibold text-sm tracking-tight"
          >ParkManager</span
        >
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <AdminNavItem to="/dashboard" label="Panoramica" :exact="true">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem to="/dashboard/bookings" label="Prenotazioni">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem to="/dashboard/calendar" label="Calendario">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V12zm0 3h.008v.008H12V15zm0 3h.008v.008H12V18zm-3-6h.008v.008H9V12zm0 3h.008v.008H9V15zm0 3h.008v.008H9V18zm6-6h.008v.008H15V12zm0 3h.008v.008H15V15zm0 3h.008v.008H15V18z"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem to="/dashboard/customers" label="Clienti">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem
          to="/dashboard/manual-booking"
          label="Prenotazione Manuale"
        >
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </template>
        </AdminNavItem>

        <!-- Section divider -->
        <div class="pt-4 pb-1 px-3">
          <p
            class="text-[10px] font-semibold text-slate-600 uppercase tracking-widest"
          >
            Gestione
          </p>
        </div>

        <AdminNavItem to="/dashboard/operating-hours" label="Orari di Apertura">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem to="/dashboard/closures" label="Periodi di Chiusura">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </template>
        </AdminNavItem>

        <AdminNavItem to="/dashboard/settings" label="Impostazioni">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </template>
        </AdminNavItem>
      </nav>

      <!-- User footer -->
      <div class="border-t border-white/5 p-3 shrink-0">
        <div class="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
          <div
            class="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs shrink-0"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-xs font-medium text-slate-200 truncate leading-tight"
            >
              {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
            </p>
            <p class="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
              {{ authStore.user?.email }}
            </p>
          </div>
          <button
            class="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            title="Esci"
            @click="handleLogout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Backdrop (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 lg:ml-60 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center px-5 gap-4"
      >
        <button
          class="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <h1 class="text-sm font-semibold text-gray-800">{{ pageTitle }}</h1>
        <div class="ml-auto flex items-center gap-4 text-xs text-gray-400">
          <NuxtLink
            to="/"
            class="hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Sito
          </NuxtLink>
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

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  }
);
</script>
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
