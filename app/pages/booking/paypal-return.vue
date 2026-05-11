<template>
  <div class="max-w-lg mx-auto px-6 py-20 text-center">
    <!-- Processing -->
    <template v-if="status === 'processing'">
      <div
        class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-8 h-8 text-blue-500 animate-spin"
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
      <h1 class="text-xl font-bold text-gray-800 mb-2">
        Conferma del pagamento…
      </h1>
      <p class="text-gray-400 text-sm">
        Stiamo elaborando il tuo pagamento PayPal. Attendi un momento.
      </p>
    </template>

    <!-- Success -->
    <template v-else-if="status === 'success'">
      <div
        class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">
        Pagamento confermato!
      </h1>
      <p class="text-gray-400 text-sm mb-8">
        Il tuo pagamento PayPal è stato elaborato con successo.
      </p>
      <NuxtLink
        to="/booking/success"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm uppercase tracking-widest"
      >
        Vedi prenotazione
      </NuxtLink>
    </template>

    <!-- Error -->
    <template v-else-if="status === 'error'">
      <div
        class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">
        Pagamento non riuscito
      </h1>
      <p class="text-gray-400 text-sm mb-2">{{ errorMessage }}</p>
      <p class="text-gray-300 text-xs mb-8">
        La tua prenotazione è ancora in attesa. Puoi riprovare a pagare.
      </p>
      <NuxtLink
        to="/booking"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm uppercase tracking-widest"
      >
        Torna alle prenotazioni
      </NuxtLink>
    </template>

    <!-- Cancelled -->
    <template v-else-if="status === 'cancelled'">
      <div
        class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Pagamento annullato</h1>
      <p class="text-gray-400 text-sm mb-8">
        Hai annullato il pagamento. La prenotazione è ancora in attesa.
      </p>
      <NuxtLink
        to="/booking"
        class="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm uppercase tracking-widest"
      >
        Torna alle prenotazioni
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const { capturePayPalPayment } = useBookings();

// PayPal appends `token` (order ID) and `PayerID` to the return URL.
// Our backend return_url includes `booking_id` as a query param.
const bookingId = route.query.booking_id as string | undefined;
const token = route.query.token as string | undefined; // PayPal order ID

type Status = "processing" | "success" | "error" | "cancelled";
const status = ref<Status>("processing");
const errorMessage = ref(
  "Si è verificato un errore durante la conferma del pagamento."
);

onMounted(async () => {
  // No token means user cancelled or landed here by mistake
  if (!token || !bookingId) {
    status.value = "cancelled";
    return;
  }

  const ok = await capturePayPalPayment(bookingId, token);
  if (ok) {
    status.value = "success";
    // Auto-redirect to success page after a short delay
    setTimeout(() => navigateTo("/booking/success"), 2000);
  } else {
    status.value = "error";
  }
});
</script>
