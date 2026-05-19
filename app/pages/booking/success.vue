<template>
  <div class="max-w-2xl mx-auto px-6 py-16 text-center">

    <!-- Verifying -->
    <template v-if="verifying">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background:rgba(27,42,107,0.08)">
        <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" style="color:var(--navy)">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
      <h1 class="text-xl font-bold mb-2" style="color:var(--gray-800)">Conferma in corso…</h1>
      <p class="text-sm" style="color:var(--gray-400)">Stiamo verificando il tuo pagamento.</p>
    </template>

    <!-- Paid -->
    <template v-else-if="paid">
      <div class="text-6xl mb-6">✅</div>
      <h1 class="text-2xl font-bold mb-2" style="color:var(--gray-800)">Pagamento confermato!</h1>
      <p class="mb-8" style="color:var(--gray-400)">La tua prenotazione è stata pagata con successo.</p>

      <div v-if="booking" class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left text-sm">
        <div class="grid grid-cols-2 gap-3">
          <div class="uppercase tracking-wide text-xs" style="color:var(--gray-400)">Posto</div>
          <div class="font-semibold" style="color:var(--gray-800)">{{ booking.spot_identifier }} — {{ booking.location_name }}</div>
          <div class="uppercase tracking-wide text-xs" style="color:var(--gray-400)">Ingresso</div>
          <div class="font-semibold" style="color:var(--gray-800)">{{ formatDt(booking.start_time) }}</div>
          <div class="uppercase tracking-wide text-xs" style="color:var(--gray-400)">Uscita</div>
          <div class="font-semibold" style="color:var(--gray-800)">{{ formatDt(booking.end_time) }}</div>
          <div class="uppercase tracking-wide text-xs" style="color:var(--gray-400)">Totale pagato</div>
          <div class="font-bold" style="color:var(--navy)">€ {{ booking.price }}</div>
        </div>
      </div>

      <NuxtLink to="/booking" class="btn btn-navy">Vedi le mie prenotazioni</NuxtLink>
    </template>

    <!-- Processing (webhook delayed) -->
    <template v-else-if="pollingTimeout">
      <div class="text-6xl mb-6">⏳</div>
      <h1 class="text-2xl font-bold mb-2" style="color:var(--gray-800)">Pagamento in elaborazione</h1>
      <p class="mb-8" style="color:var(--gray-400)">
        Il pagamento è stato ricevuto ma la conferma è ancora in corso. Controlla lo stato nelle tue prenotazioni tra qualche minuto.
      </p>
      <NuxtLink to="/booking" class="btn btn-navy">Vedi le mie prenotazioni</NuxtLink>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="text-6xl mb-6">❌</div>
      <h1 class="text-2xl font-bold mb-2" style="color:var(--gray-800)">Errore nella verifica</h1>
      <p class="mb-8" style="color:var(--gray-400)">{{ error }}</p>
      <NuxtLink to="/booking" class="btn btn-navy">Torna alle prenotazioni</NuxtLink>
    </template>

  </div>
</template>

<script setup lang="ts">
import type { Booking } from '~/types';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const api = useApi();

const sessionId = route.query.session_id as string | undefined;

const verifying      = ref(true);
const paid           = ref(false);
const pollingTimeout = ref(false);
const error          = ref<string | null>(null);
const booking        = ref<Booking | null>(null);

function formatDt(iso: string) {
  return new Date(iso).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

onMounted(async () => {
  if (!sessionId) return navigateTo('/booking');

  const MAX_ATTEMPTS = 5;
  const DELAY_MS     = 2000;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, DELAY_MS));
    try {
      const data = await api<{ paid: boolean; booking: Booking }>(`/payments/verify/?session_id=${sessionId}`);
      booking.value = data.booking;
      if (data.paid) {
        paid.value      = true;
        verifying.value = false;
        return;
      }
    } catch (err: unknown) {
      error.value     = err instanceof Error ? err.message : 'Errore di verifica.';
      verifying.value = false;
      return;
    }
  }

  pollingTimeout.value = true;
  verifying.value      = false;
});
</script>
