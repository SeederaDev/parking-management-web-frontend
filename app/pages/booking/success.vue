<template>
  <div class="max-w-2xl mx-auto px-6 py-16 text-center">
    <!-- Loading / verifying -->
    <template v-if="verifying">
      <div
        class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-8 h-8 text-indigo-500 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Conferma in corso…</h1>
      <p class="text-gray-400 text-sm">Stiamo verificando il tuo pagamento.</p>
    </template>

    <!-- Paid -->
    <template v-else-if="paid">
      <div class="text-6xl mb-6">✅</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Pagamento confermato!
      </h1>
      <p class="text-gray-400 mb-8">
        La tua prenotazione è stata pagata con successo.
      </p>

      <!-- Booking summary -->
      <div
        v-if="booking"
        class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left text-sm"
      >
        <div class="grid grid-cols-2 gap-3">
          <div class="text-gray-400 uppercase tracking-wide text-xs">Posto</div>
          <div class="font-semibold text-gray-800">
            {{ booking.spot_identifier }} — {{ booking.location_name }}
          </div>
          <div class="text-gray-400 uppercase tracking-wide text-xs">
            Ingresso
          </div>
          <div class="font-semibold text-gray-800">
            {{ formatDt(booking.start_time) }}
          </div>
          <div class="text-gray-400 uppercase tracking-wide text-xs">
            Uscita
          </div>
          <div class="font-semibold text-gray-800">
            {{ formatDt(booking.end_time) }}
          </div>
          <div class="text-gray-400 uppercase tracking-wide text-xs">
            Totale pagato
          </div>
          <div class="font-bold text-indigo-600">€ {{ booking.price }}</div>
        </div>
      </div>

      <NuxtLink
        to="/booking"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm"
      >
        Vedi le mie prenotazioni
      </NuxtLink>
    </template>

    <!-- Not paid yet (webhook delayed) — show polling message -->
    <template v-else-if="pollingTimeout">
      <div class="text-6xl mb-6">⏳</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Pagamento in elaborazione
      </h1>
      <p class="text-gray-400 mb-8">
        Il pagamento è stato ricevuto ma la conferma è ancora in corso.
        Controlla lo stato nelle tue prenotazioni tra qualche minuto.
      </p>
      <NuxtLink
        to="/booking"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm"
      >
        Vedi le mie prenotazioni
      </NuxtLink>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="text-6xl mb-6">❌</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Errore nella verifica
      </h1>
      <p class="text-gray-400 mb-8">{{ error }}</p>
      <NuxtLink
        to="/booking"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm"
      >
        Torna alle prenotazioni
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from "~/types";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const api = useApi();

const sessionId = route.query.session_id as string | undefined;

const verifying = ref(true);
const paid = ref(false);
const pollingTimeout = ref(false);
const error = ref<string | null>(null);
const booking = ref<Booking | null>(null);

function formatDt(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(async () => {
  // No session_id means user navigated here directly — redirect to bookings
  if (!sessionId) {
    return navigateTo("/booking");
  }

  // Poll up to ~10s for the webhook to mark the booking as paid
  const MAX_ATTEMPTS = 5;
  const DELAY_MS = 2000;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
    try {
      const data = await api<{ paid: boolean; booking: Booking }>(
        `/payments/verify/?session_id=${sessionId}`
      );
      booking.value = data.booking;
      if (data.paid) {
        paid.value = true;
        verifying.value = false;
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore di verifica.";
      error.value = msg;
      verifying.value = false;
      return;
    }
  }

  // Webhook still hasn't fired after polling — show "processing" state
  pollingTimeout.value = true;
  verifying.value = false;
});
</script>

