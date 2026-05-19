<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-8" style="color:var(--gray-800)">La tua prenotazione</h1>

    <!-- User data summary -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div class="pb-3" style="border-bottom:1px solid var(--gray-100)">
          <span class="font-bold uppercase tracking-wide" style="color:var(--gray-800)">{{ authStore.user?.first_name }}</span>
        </div>
        <div class="pb-3" style="border-bottom:1px solid var(--gray-100)">
          <span class="font-bold uppercase tracking-wide" style="color:var(--gray-800)">{{ authStore.user?.last_name }}</span>
        </div>
        <div class="pb-3 uppercase" style="border-bottom:1px solid var(--gray-100); color:var(--gray-400)">—</div>
        <div class="pb-3" style="border-bottom:1px solid var(--gray-100); color:var(--gray-700)">{{ authStore.user?.email }}</div>
        <div class="pb-3 uppercase tracking-wide text-xs" style="border-bottom:1px solid var(--gray-100); color:var(--gray-400)">Modello del veicolo</div>
        <div class="pb-3 uppercase tracking-wide text-xs" style="border-bottom:1px solid var(--gray-100); color:var(--gray-400)">Targa</div>
        <div class="col-span-2 uppercase tracking-wide text-xs" style="color:var(--gray-400)">Messaggio</div>
      </div>
    </div>

    <h2 class="text-lg font-bold mb-4" style="color:var(--gray-800)">Scegli il metodo di pagamento</h2>

    <div class="space-y-3 mb-8">
      <!-- Carta (Stripe) -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :style="selectedMethod === 'stripe' ? 'border-color:var(--navy)' : 'border-color:var(--gray-100)'"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
            :style="selectedMethod === 'stripe' ? 'border-color:var(--navy)' : 'border-color:var(--gray-200)'"
          >
            <div v-if="selectedMethod === 'stripe'" class="w-2.5 h-2.5 rounded-full" style="background:var(--navy)" />
          </div>
          <input type="radio" v-model="selectedMethod" value="stripe" class="sr-only" />
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con Carta</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">MC</div>
          <div class="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">VISA</div>
          <div class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">●●</div>
          <div class="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">AMEX</div>
        </div>
      </label>

      <!-- PayPal -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :style="selectedMethod === 'paypal' ? 'border-color:var(--navy)' : 'border-color:var(--gray-100)'"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
            :style="selectedMethod === 'paypal' ? 'border-color:var(--navy)' : 'border-color:var(--gray-200)'"
          >
            <div v-if="selectedMethod === 'paypal'" class="w-2.5 h-2.5 rounded-full" style="background:var(--navy)" />
          </div>
          <input type="radio" v-model="selectedMethod" value="paypal" class="sr-only" />
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con il tuo conto PayPal</span>
        </div>
        <span class="font-bold text-sm"><span class="text-blue-700">Pay</span><span class="text-blue-400">Pal</span></span>
      </label>

      <!-- Satispay (disabled) -->
      <label class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed" style="border-color:var(--gray-100)">
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 shrink-0" style="border-color:var(--gray-200)" />
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con Satispay</span>
        </div>
        <span class="text-red-600 font-bold text-sm">satispay</span>
      </label>

      <!-- Bonifico (disabled) -->
      <label class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 opacity-50 cursor-not-allowed" style="border-color:var(--gray-100)">
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 shrink-0" style="border-color:var(--gray-200)" />
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con Bonifico</span>
        </div>
      </label>
    </div>

    <p v-if="checkoutError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{{ checkoutError }}</p>

    <button
      :disabled="!selectedMethod || checkoutLoading"
      class="w-full text-white font-bold py-4 rounded-xl disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
      style="background:var(--navy)"
      @mouseenter="e => { if (selectedMethod && !checkoutLoading) (e.currentTarget as HTMLElement).style.background='var(--navy-deep)' }"
      @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--navy)'"
      @click="confirmAndPay"
    >
      {{ checkoutLoading ? 'Reindirizzamento…' : 'Conferma e Paga' }}
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const route = useRoute();
const authStore = useAuthStore();
const { initiateCheckout, initiatePayPalPayment } = useBookings();

const bookingId = route.query.booking_id as string;
const selectedMethod = ref('stripe');
const checkoutLoading = ref(false);
const checkoutError = ref<string | null>(null);

async function confirmAndPay() {
  if (!bookingId) return;
  checkoutLoading.value = true;
  checkoutError.value = null;
  try {
    if (selectedMethod.value === 'stripe') {
      const url = await initiateCheckout(bookingId);
      if (url) navigateTo(url, { external: true });
      else checkoutError.value = 'Errore nell\'avvio del pagamento. Riprova.';
    } else if (selectedMethod.value === 'paypal') {
      const approveUrl = await initiatePayPalPayment(bookingId);
      if (approveUrl) navigateTo(approveUrl, { external: true });
      else checkoutError.value = 'Errore nell\'avvio del pagamento PayPal. Riprova.';
    }
  } catch {
    checkoutError.value = 'Errore nell\'avvio del pagamento. Riprova.';
  } finally {
    checkoutLoading.value = false;
  }
}

onMounted(() => { if (!bookingId) navigateTo('/booking'); });
</script>
