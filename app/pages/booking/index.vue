<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <!-- New booking form (if coming from parking page) -->
    <BookingBookingForm
      v-if="route.query.spot_id"
      :spot-id="(route.query.spot_id as string)"
      :spot-identifier="(route.query.spot_identifier as string)"
      :spot-type="(route.query.spot_type as string) || 'standard'"
      :location-id="(route.query.location_id as string) || ''"
      :start-time="(route.query.start_time as string)"
      :end-time="(route.query.end_time as string)"
      @confirmed="onBookingConfirmed"
    />

    <!-- Booking list -->
    <template v-else>
      <div class="sec-label mb-2">Le mie prenotazioni</div>
      <h1 class="sec-title mb-10">I tuoi posti prenotati</h1>

      <div v-if="bookingStore.loading" class="text-center py-12 text-gray-400">Caricamento…</div>

      <div v-else-if="bookingStore.bookings.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-5xl mb-4">🅿</div>
        <p class="mb-6">Nessuna prenotazione ancora.</p>
        <NuxtLink to="/parcheggio" class="btn btn-navy">Prenota un posto</NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="booking in bookingStore.bookings"
          :key="booking.id"
          class="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <div class="font-bold text-navy-deep text-sm truncate">
              Posto {{ booking.spot_identifier }} — {{ booking.location_name }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatDate(booking.start_time) }} → {{ formatDate(booking.end_time) }}
            </div>
            <div class="text-xs font-bold mt-1" style="color:var(--navy)">€{{ booking.price }}</div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <span :class="statusClass(booking.status)" class="px-2.5 py-1 rounded-full text-xs font-bold">
              {{ statusLabel(booking.status) }}
            </span>
            <button
              v-if="booking.status === 'pending'"
              class="text-xs font-bold text-navy hover:text-navy-deep transition-colors"
              :disabled="bookingLoading"
              @click="pay(booking.id)"
            >
              Paga ora
            </button>
            <button
              v-if="booking.status === 'pending'"
              class="text-xs font-bold text-brand-red hover:text-brand-red-hover transition-colors"
              :disabled="bookingLoading"
              @click="cancel(booking.id)"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const bookingStore = useBookingStore();
const { fetchBookings, initiateCheckout, cancelBooking, loading: bookingLoading } = useBookings();

async function pay(bookingId: string) {
  const url = await initiateCheckout(bookingId);
  if (url) navigateTo(url, { external: true });
}

async function cancel(bookingId: string) {
  await cancelBooking(bookingId);
}

function onBookingConfirmed() {
  fetchBookings();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function statusClass(status: string) {
  return (
    { pending: "bg-amber-100 text-amber-700", paid: "bg-emerald-100 text-emerald-700", cancelled: "bg-gray-100 text-gray-500" }[status] ?? "bg-gray-100 text-gray-500"
  );
}

function statusLabel(status: string) {
  return { pending: "In attesa", paid: "Pagata", cancelled: "Annullata" }[status] ?? status;
}

onMounted(fetchBookings);
</script>
