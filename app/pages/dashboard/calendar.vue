<template>
  <div class="space-y-6">

    <!-- Date controls -->
    <div class="flex flex-wrap gap-3 items-end">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">Dal</label>
        <input
          v-model="dateFrom"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">Al</label>
        <input
          v-model="dateTo"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        />
      </div>
      <button
        class="px-5 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
        style="background:var(--navy)"
        @mouseenter="e => (e.currentTarget as HTMLElement).style.background='var(--navy-deep)'"
        @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--navy)'"
        @click="load"
      >
        Aggiorna
      </button>
    </div>

    <div v-if="loading" class="text-center py-16 text-sm text-gray-400">Caricamento…</div>

    <div
      v-else-if="!calendarBookings.length"
      class="text-center py-16 bg-white rounded-xl border border-gray-100 text-sm text-gray-400"
    >
      Nessuna prenotazione nel periodo selezionato.
    </div>

    <div v-else class="space-y-8">
      <div v-for="[date, items] in groupedByDate" :key="date">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          {{ formatGroupDate(date) }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="b in items"
            :key="b.id"
            class="bg-white rounded-xl border p-4 text-sm"
            :style="cardStyle(b.status)"
          >
            <div class="flex items-start justify-between mb-3">
              <span class="font-semibold text-navy-deep">{{ b.user_first_name }} {{ b.user_last_name }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusClass(b.status)">
                {{ statusLabel(b.status) }}
              </span>
            </div>
            <div class="space-y-1 text-gray-500">
              <p>{{ b.location_name }} · <span class="font-mono font-semibold text-navy-deep">{{ b.spot_identifier }}</span></p>
              <p>{{ formatTime(b.start_time) }} → {{ formatTime(b.end_time) }}</p>
            </div>
            <p class="mt-3 font-semibold text-navy-deep">€{{ b.price }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { BookingStatus } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { calendarBookings, loading, fetchCalendar } = useAdminCalendar();

const today = new Date();
const dateFrom = ref(today.toISOString().slice(0, 10));
const dateTo = ref(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

const groupedByDate = computed(() => {
  const map = new Map<string, typeof calendarBookings.value>();
  for (const b of calendarBookings.value) {
    const day = b.start_time.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(b);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
});

function load() { fetchCalendar(dateFrom.value, dateTo.value); }

function formatGroupDate(date: string) {
  return new Date(date).toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
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

function cardStyle(s: BookingStatus) {
  return ({
    pending:   "border-color:#FDE68A",
    paid:      "border-color:#A7F3D0",
    cancelled: "border-color:#FECACA",
    refunded:  "border-color:#E5E7EB",
  } as Record<string, string>)[s] ?? "border-color:#F3F4F6";
}

onMounted(load);
</script>
