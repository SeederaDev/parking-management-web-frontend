<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <DashboardStatsCard label="Prenotazioni totali" :value="stats.total" icon="📋" color="indigo" />
      <DashboardStatsCard label="Ricavi totali" :value="`€${stats.revenue}`" icon="💶" color="green" />
      <DashboardStatsCard label="In attesa di pagamento" :value="stats.pending" icon="⏳" color="yellow" />
      <DashboardStatsCard label="Annullate" :value="stats.cancelled" icon="❌" color="red" />
    </div>

    <!-- Recent bookings -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-800">Prenotazioni recenti</h2>
        <NuxtLink to="/dashboard/bookings" class="text-sm text-indigo-600 hover:underline">Vedi tutte →</NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-400">Caricamento…</div>
      <div v-else-if="!recentBookings.length" class="text-center py-10 text-gray-400">Nessuna prenotazione.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-gray-500 border-b border-gray-100">
              <th class="pb-3 font-medium">Cliente</th>
              <th class="pb-3 font-medium">Posto</th>
              <th class="pb-3 font-medium">Da</th>
              <th class="pb-3 font-medium">A</th>
              <th class="pb-3 font-medium">Prezzo</th>
              <th class="pb-3 font-medium">Stato</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-gray-50">
              <td class="py-3">{{ b.user_first_name }} {{ b.user_last_name }}</td>
              <td class="py-3 text-gray-500">{{ b.spot }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.start_time) }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.end_time) }}</td>
              <td class="py-3 font-medium">€{{ b.price }}</td>
              <td class="py-3">
                <span :class="statusClass(b.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
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
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function statusLabel(s: BookingStatus) {
  return { pending: "In attesa", paid: "Pagata", cancelled: "Annullata", refunded: "Rimborsata" }[s] ?? s;
}

function statusClass(s: BookingStatus) {
  return {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-700",
  }[s] ?? "bg-gray-100 text-gray-700";
}

onMounted(() => fetchBookings());
</script>
