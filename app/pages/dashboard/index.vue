<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardStatsCard
        label="Prenotazioni totali"
        :value="stats.total"
        color="blue"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
      </DashboardStatsCard>
      <DashboardStatsCard
        label="Ricavi totali"
        :value="`€${stats.revenue}`"
        color="green"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </DashboardStatsCard>
      <DashboardStatsCard
        label="In attesa di pagamento"
        :value="stats.pending"
        color="yellow"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
      </DashboardStatsCard>
      <DashboardStatsCard
        label="Annullate"
        :value="stats.cancelled"
        color="red"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
      </DashboardStatsCard>
    </div>

    <!-- Recent bookings -->
    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-800">
          Prenotazioni recenti
        </h2>
        <NuxtLink
          to="/dashboard/bookings"
          class="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >Vedi tutte →</NuxtLink
        >
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-400">
        Caricamento…
      </div>
      <div
        v-else-if="!recentBookings.length"
        class="text-center py-10 text-gray-400"
      >
        Nessuna prenotazione.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="text-left text-xs text-gray-500 border-b border-gray-100"
            >
              <th class="pb-3 font-medium">Cliente</th>
              <th class="pb-3 font-medium">Posto</th>
              <th class="pb-3 font-medium">Da</th>
              <th class="pb-3 font-medium">A</th>
              <th class="pb-3 font-medium">Prezzo</th>
              <th class="pb-3 font-medium">Stato</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="b in recentBookings"
              :key="b.id"
              class="hover:bg-gray-50"
            >
              <td class="py-3">
                {{ b.user_first_name }} {{ b.user_last_name }}
              </td>
              <td class="py-3 text-gray-500">{{ b.spot }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.start_time) }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.end_time) }}</td>
              <td class="py-3 font-medium">€{{ b.price }}</td>
              <td class="py-3">
                <span
                  :class="statusClass(b.status)"
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ statusLabel(b.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookingStatus } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { bookings, loading, fetchBookings } = useAdminBookings();

const recentBookings = computed(() => bookings.value.slice(0, 10));

const stats = computed(() => {
  const all = bookings.value;
  const revenue = all
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + parseFloat(b.price), 0)
    .toFixed(2);
  return {
    total: all.length,
    revenue,
    pending: all.filter((b) => b.status === "pending").length,
    cancelled: all.filter((b) => b.status === "cancelled").length,
  };
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(s: BookingStatus) {
  return (
    {
      pending: "In attesa",
      paid: "Pagata",
      cancelled: "Annullata",
      refunded: "Rimborsata",
    }[s] ?? s
  );
}

function statusClass(s: BookingStatus) {
  return (
    {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-700",
    }[s] ?? "bg-gray-100 text-gray-700"
  );
}

onMounted(() => fetchBookings());
</script>
