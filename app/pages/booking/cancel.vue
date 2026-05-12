<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-4xl">🅿</span>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">ParkManager</h1>
        <p class="text-gray-500 text-sm mt-1">Annullamento prenotazione</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <!-- Loading -->
        <div v-if="state === 'loading'" class="text-center py-8 text-gray-400">
          Verifica del token…
        </div>

        <!-- Already done -->
        <div v-else-if="state === 'done'" class="text-center py-8">
          <div class="text-4xl mb-3">✅</div>
          <p class="text-green-700 font-medium">
            Prenotazione annullata con successo.
          </p>
          <p v-if="refundMessage" class="text-sm text-gray-500 mt-2">
            {{ refundMessage }}
          </p>
        </div>

        <!-- Error -->
        <div v-else-if="state === 'error'" class="text-center py-8">
          <div class="text-4xl mb-3">⚠️</div>
          <p class="text-red-700 font-medium">{{ errorMsg }}</p>
        </div>

        <!-- Confirm -->
        <div v-else>
          <p class="text-gray-700 text-sm mb-4">
            Stai per annullare la seguente prenotazione. Questa azione non può
            essere annullata.
          </p>

          <div
            v-if="bookingInfo"
            class="bg-gray-50 rounded-xl p-4 text-sm space-y-1 mb-6"
          >
            <p>
              <span class="text-gray-500">Posto:</span>
              <span class="font-medium">{{ bookingInfo.spot }}</span>
            </p>
            <p>
              <span class="text-gray-500">Dal:</span>
              {{ formatDate(bookingInfo.start_time) }}
            </p>
            <p>
              <span class="text-gray-500">Al:</span>
              {{ formatDate(bookingInfo.end_time) }}
            </p>
            <p>
              <span class="text-gray-500">Importo:</span>
              <span class="font-medium">€{{ bookingInfo.price }}</span>
            </p>
            <p>
              <span class="text-gray-500">Rimborso:</span>
              <span
                :class="
                  bookingInfo.refund_eligible
                    ? 'text-green-600'
                    : 'text-red-500'
                "
                class="font-medium ml-1"
              >
                {{
                  bookingInfo.refund_eligible
                    ? "Eleggibile"
                    : "Non eleggibile (scaduto il termine)"
                }}
              </span>
            </p>
          </div>

          <div class="flex gap-3">
            <NuxtLink
              to="/"
              class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Torna alla home
            </NuxtLink>
            <button
              :disabled="cancelling"
              class="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              @click="confirm"
            >
              {{ cancelling ? "Annullamento…" : "Conferma annullamento" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const config = useRuntimeConfig();

const token = computed(() => route.query.token as string | undefined);

type State = "loading" | "confirm" | "done" | "error";

const state = ref<State>("loading");
const errorMsg = ref("");
const cancelling = ref(false);
const refundMessage = ref("");

interface BookingPreview {
  spot: string;
  start_time: string;
  end_time: string;
  price: string;
  refund_eligible: boolean;
}

const bookingInfo = ref<BookingPreview | null>(null);

onMounted(async () => {
  if (!token.value) {
    errorMsg.value = "Token mancante o non valido.";
    state.value = "error";
    return;
  }

  // Verify token by fetching preview (the cancel endpoint requires POST, so we just
  // show what we know from the query and let the user confirm)
  // If the backend provides a GET endpoint for previewing we could call it here.
  // For now we trust the token and show a generic confirmation.
  bookingInfo.value = null; // no preview endpoint yet
  state.value = "confirm";
});

async function confirm() {
  cancelling.value = true;
  try {
    const res = await $fetch<{ message?: string; refund_issued?: boolean }>(
      `${config.public.apiBase}/bookings/cancel-by-token/`,
      {
        method: "POST",
        body: { token: token.value },
      }
    );
    refundMessage.value = res.refund_issued
      ? "Il rimborso è stato emesso automaticamente."
      : "Nessun rimborso previsto per questa prenotazione.";
    state.value = "done";
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "data" in err
        ? (err as { data: { detail?: string } }).data?.detail ??
          "Errore durante l'annullamento."
        : "Errore durante l'annullamento.";
    errorMsg.value = msg;
    state.value = "error";
  } finally {
    cancelling.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
