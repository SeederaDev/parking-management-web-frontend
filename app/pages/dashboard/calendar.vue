<template>
  <div>
    <!-- Date range controls -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-end"
    >
      <div>
        <label class="block text-xs text-gray-500 mb-1">Dal</label>
        <input
          v-model="dateFrom"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Al</label>
        <input
          v-model="dateTo"
          type="date"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <button
        class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        @click="load"
      >
        Carica
      </button>
    </div>

    <!-- Loading / empty -->
    <div v-if="loading" class="text-center py-16 text-gray-400">
      Caricamento…
    </div>
    <div
      v-else-if="!calendarBookings.length"
      class="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100"
    >
      Nessuna prenotazione nel periodo selezionato.
    </div>

    <!-- Cards grouped by date -->
    <div v-else class="space-y-6">
      <div v-for="[date, items] in groupedByDate" :key="date">
        <h3
          class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"
        >
          {{ formatGroupDate(date) }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="b in items"
            :key="b.id"
            :class="cardClass(b.status)"
            class="rounded-xl border p-4 text-sm"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-800"
                >{{ b.user_first_name }} {{ b.user_last_name }}</span
              >
              <span
                :class="statusClass(b.status)"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ statusLabel(b.status) }}
              </span>
            </div>
            <p class="text-gray-500">
              📍 {{ b.location_name }} · {{ b.spot_identifier }}
            </p>
            <p class="text-gray-500">🚗 {{ b.spot_type }}</p>
            <p class="text-gray-600 mt-1">
              {{ formatTime(b.start_time) }} → {{ formatTime(b.end_time) }}
            </p>
            <p class="mt-1 font-medium text-gray-800">€{{ b.price }}</p>
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
const dateTo = ref(
  new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
);

const groupedByDate = computed(() => {
  const map = new Map<string, typeof calendarBookings.value>();
  for (const b of calendarBookings.value) {
    const day = b.start_time.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(b);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
});

function load() {
  fetchCalendar(dateFrom.value, dateTo.value);
}

function formatGroupDate(date: string) {
  return new Date(date).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", {
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
  return {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-700",
  }[s];
}

function cardClass(s: BookingStatus) {
  return (
    {
      pending: "bg-yellow-50 border-yellow-200",
      paid: "bg-green-50 border-green-200",
      cancelled: "bg-red-50 border-red-200",
      refunded: "bg-gray-50 border-gray-200",
    }[s] ?? "bg-white border-gray-100"
  );
}

onMounted(load);
</script>
