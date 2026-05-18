<template>
  <div>
    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 items-center">
      <select
        v-model="filters.status"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        @change="reload"
      >
        <option value="">Tutti gli stati</option>
        <option value="pending">In attesa</option>
        <option value="paid">Pagata</option>
        <option value="cancelled">Annullata</option>
        <option value="refunded">Rimborsata</option>
      </select>
      <input
        v-model="filters.date_from"
        type="date"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        @change="reload"
      />
      <input
        v-model="filters.date_to"
        type="date"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        @change="reload"
      />
      <button
        class="ml-auto text-sm text-gray-500 hover:text-navy font-medium transition-colors"
        @click="clearFilters"
      >
        Azzera filtri
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <p class="text-sm text-gray-400 mb-5">{{ total }} prenotazioni trovate</p>

      <div v-if="loading" class="text-center py-10 text-gray-400">Caricamento…</div>
      <div v-else-if="!bookings.length" class="text-center py-10 text-gray-400">Nessuna prenotazione.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th class="pb-3 font-semibold">Cliente</th>
              <th class="pb-3 font-semibold">Posto</th>
              <th class="pb-3 font-semibold">Tipo</th>
              <th class="pb-3 font-semibold">Da</th>
              <th class="pb-3 font-semibold">A</th>
              <th class="pb-3 font-semibold">Prezzo</th>
              <th class="pb-3 font-semibold">Pagamento</th>
              <th class="pb-3 font-semibold">Stato</th>
              <th class="pb-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="b in bookings" :key="b.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 font-medium text-navy-deep">{{ b.user_first_name }} {{ b.user_last_name }}</td>
              <td class="py-3 text-gray-500 font-mono text-xs">{{ b.spot }}</td>
              <td class="py-3 text-gray-500">{{ b.spot_type }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.start_time) }}</td>
              <td class="py-3 text-gray-500">{{ formatDate(b.end_time) }}</td>
              <td class="py-3 font-semibold text-navy-deep">€{{ b.price }}</td>
              <td class="py-3">
                <span :class="b.payment_type === 'online' ? 'text-navy font-medium' : 'text-gray-500'">
                  {{ b.payment_type === "online" ? "Online" : "Offline" }}
                </span>
              </td>
              <td class="py-3">
                <span :class="statusClass(b.status)" class="px-2 py-0.5 rounded-full text-xs font-semibold">
                  {{ statusLabel(b.status) }}
                </span>
              </td>
              <td class="py-3 text-right">
                <button
                  v-if="b.status === 'pending' || b.status === 'paid'"
                  class="text-xs text-brand-red hover:text-brand-red-hover font-medium transition-colors"
                  @click="openCancelModal(b.id)"
                >
                  Annulla
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cancel modal -->
    <div
      v-if="cancelModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      @click.self="cancelModal.open = false"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 class="text-base font-semibold text-navy-deep mb-3">Annulla prenotazione</h3>
        <p class="text-sm text-gray-600 mb-4">Vuoi emettere un rimborso automatico se applicabile?</p>
        <label class="flex items-center gap-2 text-sm text-gray-700 mb-5 cursor-pointer">
          <input v-model="cancelModal.refund" type="checkbox" class="rounded border-gray-300 text-navy" />
          Rimborsa automaticamente
        </label>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
            @click="cancelModal.open = false"
          >
            Indietro
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm bg-brand-red text-white hover:bg-brand-red-hover disabled:opacity-50 font-semibold transition-colors"
            :disabled="loading"
            @click="confirmCancel"
          >
            Annulla prenotazione
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminBookingFilters, BookingStatus } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { bookings, total, loading, fetchBookings, cancelBooking } = useAdminBookings();

const filters = reactive<AdminBookingFilters>({ status: undefined, date_from: undefined, date_to: undefined });
const cancelModal = reactive({ open: false, bookingId: "", refund: false });

function reload() { fetchBookings(filters); }
function clearFilters() {
  filters.status = undefined;
  filters.date_from = undefined;
  filters.date_to = undefined;
  reload();
}

function openCancelModal(id: string) {
  cancelModal.bookingId = id;
  cancelModal.refund = false;
  cancelModal.open = true;
}

async function confirmCancel() {
  await cancelBooking(cancelModal.bookingId, cancelModal.refund);
  cancelModal.open = false;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function statusLabel(s: BookingStatus) {
  return { pending: "In attesa", paid: "Pagata", cancelled: "Annullata", refunded: "Rimborsata" }[s] ?? s;
}

function statusClass(s: BookingStatus) {
  return (
    { pending: "bg-amber-100 text-amber-800", paid: "bg-emerald-100 text-emerald-800", cancelled: "bg-red-100 text-red-800", refunded: "bg-gray-100 text-gray-600" }[s] ?? "bg-gray-100 text-gray-600"
  );
}

onMounted(reload);
</script>
