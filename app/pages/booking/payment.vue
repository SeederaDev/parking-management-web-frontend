<template>
  <div class="max-w-2xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">La tua prenotazione</h1>

    <!-- User data summary -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div class="border-b border-gray-100 pb-3">
          <span class="font-bold text-gray-800 uppercase tracking-wide">{{
            authStore.user?.first_name
          }}</span>
        </div>
        <div class="border-b border-gray-100 pb-3">
          <span class="font-bold text-gray-800 uppercase tracking-wide">{{
            authStore.user?.last_name
          }}</span>
        </div>
        <div class="border-b border-gray-100 pb-3 text-gray-500 uppercase">
          —
        </div>
        <div class="border-b border-gray-100 pb-3">
          <span class="text-gray-700">{{ authStore.user?.email }}</span>
        </div>
        <div
          class="border-b border-gray-100 pb-3 text-gray-400 uppercase tracking-wide text-xs"
        >
          Modello del veicolo
        </div>
        <div
          class="border-b border-gray-100 pb-3 text-gray-400 uppercase tracking-wide text-xs"
        >
          Targa
        </div>
        <div class="col-span-2 text-gray-400 uppercase tracking-wide text-xs">
          Messaggio
        </div>
      </div>
    </div>

    <!-- Payment methods -->
    <h2 class="text-lg font-bold text-gray-800 mb-4">
      Scegli il metodo di pagamento
    </h2>

    <div class="space-y-3 mb-8">
      <!-- Carta (Stripe) -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :class="
          selectedMethod === 'stripe'
            ? 'border-indigo-600'
            : 'border-gray-200 hover:border-gray-300'
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="
              selectedMethod === 'stripe'
                ? 'border-indigo-600'
                : 'border-gray-300'
            "
          >
            <div
              v-if="selectedMethod === 'stripe'"
              class="w-2.5 h-2.5 rounded-full bg-indigo-600"
            ></div>
          </div>
          <input
            type="radio"
            v-model="selectedMethod"
            value="stripe"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-700">Paga con Carta</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div
            class="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded"
          >
            MC
          </div>
          <div
            class="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded"
          >
            VISA
          </div>
          <div
            class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded"
          >
            ●●
          </div>
          <div
            class="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded"
          >
            AMEX
          </div>
        </div>
      </label>

      <!-- PayPal -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :class="
          selectedMethod === 'paypal'
            ? 'border-indigo-600'
            : 'border-gray-200 hover:border-gray-300'
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="
              selectedMethod === 'paypal'
                ? 'border-indigo-600'
                : 'border-gray-300'
            "
          >
            <div
              v-if="selectedMethod === 'paypal'"
              class="w-2.5 h-2.5 rounded-full bg-indigo-600"
            ></div>
          </div>
          <input
            type="radio"
            v-model="selectedMethod"
            value="paypal"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-700"
            >Paga con il tuo conto PayPal</span
          >
        </div>
        <span class="font-bold text-sm"
          ><span class="text-blue-700">Pay</span
          ><span class="text-blue-400">Pal</span></span
        >
      </label>

      <!-- Satispay (disabled) -->
      <label
        class="flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"
          ></div>
          <span class="text-sm font-medium text-gray-700"
            >Paga con Satispay</span
          >
        </div>
        <span class="text-red-600 font-bold text-sm">satispay</span>
      </label>

      <!-- Bonifico (disabled) -->
      <label
        class="flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"
          ></div>
          <span class="text-sm font-medium text-gray-700"
            >Paga con Bonifico</span
          >
        </div>
      </label>
    </div>

    <p
      v-if="checkoutError"
      class="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4"
    >
      {{ checkoutError }}
    </p>

    <!-- CTA -->
    <button
      :disabled="!selectedMethod || checkoutLoading"
      class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
      @click="confirmAndPay"
    >
      {{ checkoutLoading ? "Reindirizzamento…" : "Conferma e Paga" }}
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const authStore = useAuthStore();
const { initiateCheckout, initiatePayPalPayment } = useBookings();

const bookingId = route.query.booking_id as string;
const selectedMethod = ref("stripe");
const checkoutLoading = ref(false);
const checkoutError = ref<string | null>(null);

async function confirmAndPay() {
  if (!bookingId) return;
  checkoutLoading.value = true;
  checkoutError.value = null;
  try {
    if (selectedMethod.value === "stripe") {
      const url = await initiateCheckout(bookingId);
      if (url) {
        navigateTo(url, { external: true });
      } else {
        checkoutError.value = "Errore nell'avvio del pagamento. Riprova.";
      }
    } else if (selectedMethod.value === "paypal") {
      const approveUrl = await initiatePayPalPayment(bookingId);
      if (approveUrl) {
        navigateTo(approveUrl, { external: true });
      } else {
        checkoutError.value =
          "Errore nell'avvio del pagamento PayPal. Riprova.";
      }
    }
  } catch {
    checkoutError.value = "Errore nell'avvio del pagamento. Riprova.";
  } finally {
    checkoutLoading.value = false;
  }
}

// Redirect if no booking ID
onMounted(() => {
  if (!bookingId) navigateTo("/booking");
});
</script>
