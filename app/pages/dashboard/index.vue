<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-indigo-600">Pannello di controllo</h1>
      <p class="text-gray-400 mt-1 text-sm">
        Panoramica della tua operazione di parcheggio
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardStatsCard
        label="Prenotazioni totali"
        :value="stats.totalBookings"
        icon="📋"
        color="indigo"
      />
      <DashboardStatsCard
        label="Pagate oggi"
        :value="stats.paidToday"
        icon="💳"
        color="green"
      />
      <DashboardStatsCard
        label="In attesa"
        :value="stats.pending"
        icon="⏳"
        color="yellow"
      />
      <DashboardStatsCard
        label="Occupazione"
        :value="`${stats.occupancyRate}%`"
        icon="🅿"
        color="blue"
      />
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">
          Prenotazioni recenti
        </h2>
        <select
          v-model="statusFilter"
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">Tutti gli stati</option>
          <option value="pending">In attesa</option>
          <option value="paid">Pagata</option>
          <option value="cancelled">Annullata</option>
        </select>
      </div>

      <div v-if="bookingStore.loading" class="text-center py-8 text-gray-400">
        Caricamento…
      </div>
      <DashboardBookingTable
        v-else
        :bookings="filteredBookings"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const bookingStore = useBookingStore();
const { fetchBookings, cancelBooking } = useBookings();
const statusFilter = ref("");

const stats = computed(() => {
  const all = bookingStore.bookings;
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalBookings: all.length,
    paidToday: all.filter(
      (b) => b.status === "paid" && b.created_at.startsWith(today)
    ).length,
    pending: all.filter((b) => b.status === "pending").length,
    occupancyRate: all.length
      ? Math.round(
          (all.filter((b) => b.status === "paid").length / all.length) * 100
        )
      : 0,
  };
});

const filteredBookings = computed(() =>
  statusFilter.value
    ? bookingStore.bookings.filter((b) => b.status === statusFilter.value)
    : bookingStore.bookings
);

async function handleCancel(id: string) {
  await cancelBooking(id);
}

onMounted(fetchBookings);
</script>
