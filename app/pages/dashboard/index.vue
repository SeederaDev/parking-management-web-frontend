<template>
  <div class="space-y-6">

    <!-- Greeting -->
    <div>
      <h1 class="text-2xl font-display font-bold text-navy-deep">
        Bentornato, {{ authStore.user?.first_name }}.
      </h1>
      <p class="text-sm text-gray-400 mt-0.5">{{ today }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-gray-100 p-5">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{{ stat.label }}</p>
        <p class="text-3xl font-display font-bold tracking-tight" :style="`color:${stat.color}`">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Recent bookings (wider) -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span class="text-sm font-semibold text-navy-deep">Prenotazioni recenti</span>
          <NuxtLink to="/dashboard/bookings" class="text-xs font-semibold text-brand-red hover:text-brand-red-hover transition-colors">
            Vedi tutte →
          </NuxtLink>
        </div>
        <div v-if="loading" class="px-6 py-10 text-center text-sm text-gray-400">Caricamento…</div>
        <div v-else-if="!recentBookings.length" class="px-6 py-10 text-center text-sm text-gray-400">Nessuna prenotazione ancora.</div>
        <table v-else class="w-full text-sm">
          <tbody class="divide-y divide-gray-50">
            <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-3.5 font-medium text-navy-deep whitespace-nowrap">
                {{ b.user_first_name }} {{ b.user_last_name }}
              </td>
              <td class="px-4 py-3.5 text-gray-400 text-xs font-mono whitespace-nowrap">{{ b.spot }}</td>
              <td class="px-4 py-3.5 text-gray-500 whitespace-nowrap">{{ formatDate(b.start_time) }}</td>
              <td class="px-4 py-3.5 font-semibold text-navy-deep whitespace-nowrap">€{{ b.price }}</td>
              <td class="px-6 py-3.5 text-right">
                <span :class="statusClass(b.status)" class="px-2 py-0.5 rounded-full text-xs font-semibold">
                  {{ statusLabel(b.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick actions -->
      <div class="space-y-3">
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Azioni rapide</p>
          <div class="space-y-2">
            <NuxtLink
              to="/dashboard/manual-booking"
              class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
              style="background:var(--navy)"
              @mouseenter="e => (e.currentTarget as HTMLElement).style.background='var(--navy-deep)'"
              @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--navy)'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuova prenotazione
            </NuxtLink>
            <NuxtLink
              to="/dashboard/spots"
              class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              style="background:var(--off-white);color:var(--navy-deep)"
              @mouseenter="e => (e.currentTarget as HTMLElement).style.background='var(--gray-100)'"
              @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--off-white)'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Gestisci posti
            </NuxtLink>
            <NuxtLink
              to="/dashboard/operating-hours"
              class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              style="background:var(--off-white);color:var(--navy-deep)"
              @mouseenter="e => (e.currentTarget as HTMLElement).style.background='var(--gray-100)'"
              @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--off-white)'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Orari di apertura
            </NuxtLink>
          </div>
        </div>

        <!-- Status breakdown -->
        <div class="bg-white rounded-xl border border-gray-100 p-5">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Stato prenotazioni</p>
          <div class="space-y-3">
            <div v-for="s in statusBreakdown" :key="s.label" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :style="`background:${s.dot}`" />
                <span class="text-sm text-gray-600">{{ s.label }}</span>
              </div>
              <span class="text-sm font-semibold text-navy-deep">{{ s.count }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookingStatus } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const authStore = useAuthStore();
const { bookings, loading, fetchBookings } = useAdminBookings();

const today = new Date().toLocaleDateString("it-IT", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

const recentBookings = computed(() => bookings.value.slice(0, 8));

const stats = computed(() => {
  const all = bookings.value;
  const revenue = all.filter(b => b.status === "paid")
    .reduce((s, b) => s + parseFloat(b.price), 0).toFixed(2);
  return [
    { label: "Ricavi totali",   value: `€${revenue}`,                                  color: "var(--navy-deep)" },
    { label: "Prenotazioni",    value: all.length,                                      color: "var(--navy-deep)" },
    { label: "In attesa",       value: all.filter(b => b.status === "pending").length,  color: "#D97706" },
    { label: "Annullate",       value: all.filter(b => b.status === "cancelled").length,color: "var(--red)" },
  ];
});

const statusBreakdown = computed(() => [
  { label: "Pagate",     count: bookings.value.filter(b => b.status === "paid").length,      dot: "#10B981" },
  { label: "In attesa",  count: bookings.value.filter(b => b.status === "pending").length,   dot: "#D97706" },
  { label: "Annullate",  count: bookings.value.filter(b => b.status === "cancelled").length, dot: "var(--red)" },
  { label: "Rimborsate", count: bookings.value.filter(b => b.status === "refunded").length,  dot: "#6B7280" },
]);

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function statusLabel(s: BookingStatus) {
  return { pending: "In attesa", paid: "Pagata", cancelled: "Annullata", refunded: "Rimborsata" }[s] ?? s;
}

function statusClass(s: BookingStatus) {
  return {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-600",
  }[s] ?? "bg-gray-100 text-gray-600";
}

onMounted(() => fetchBookings());
</script>
