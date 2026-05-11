<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-100 text-gray-500 text-left">
          <th class="pb-3 font-medium">Utente</th>
          <th class="pb-3 font-medium">Posto</th>
          <th class="pb-3 font-medium">Posizione</th>
          <th class="pb-3 font-medium">Da</th>
          <th class="pb-3 font-medium">A</th>
          <th class="pb-3 font-medium">Prezzo</th>
          <th class="pb-3 font-medium">Stato</th>
          <th class="pb-3 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="booking in bookings"
          :key="booking.id"
          class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
        >
          <td class="py-3 text-gray-700">{{ booking.user_email }}</td>
          <td class="py-3 font-mono text-xs text-gray-600">
            {{ booking.spot_identifier }}
          </td>
          <td class="py-3 text-gray-600">{{ booking.location_name }}</td>
          <td class="py-3 text-gray-500">
            {{ formatDate(booking.start_time) }}
          </td>
          <td class="py-3 text-gray-500">{{ formatDate(booking.end_time) }}</td>
          <td class="py-3 font-medium text-gray-700">€{{ booking.price }}</td>
          <td class="py-3">
            <span
              :class="statusClass(booking.status)"
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ statusLabel(booking.status) }}
            </span>
          </td>
          <td class="py-3">
            <button
              v-if="booking.status === 'pending'"
              class="text-xs text-red-500 hover:underline"
              @click="$emit('cancel', booking.id)"
            >
              Annulla
            </button>
          </td>
        </tr>
        <tr v-if="bookings.length === 0">
          <td colspan="8" class="py-8 text-center text-gray-400">
            Nessuna prenotazione trovata.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from "~/stores/booking";

defineProps<{ bookings: Booking[] }>();
defineEmits<{ cancel: [id: string] }>();

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: string) {
  return (
    {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-500",
    }[status] ?? "bg-gray-100 text-gray-500"
  );
}

function statusLabel(status: string) {
  return (
    {
      pending: "In attesa",
      paid: "Pagata",
      cancelled: "Annullata",
    }[status] ?? status
  );
}
</script>
