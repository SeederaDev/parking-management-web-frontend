<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <h1 class="text-2xl font-bold mb-8" style="color:var(--gray-800)">La tua prenotazione</h1>

    <!-- User summary -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div class="pb-3" style="border-bottom:1px solid var(--gray-100)">
          <span class="font-bold uppercase tracking-wide" style="color:var(--gray-800)">{{ authStore.user?.first_name }}</span>
        </div>
        <div class="pb-3" style="border-bottom:1px solid var(--gray-100)">
          <span class="font-bold uppercase tracking-wide" style="color:var(--gray-800)">{{ authStore.user?.last_name }}</span>
        </div>
        <div class="col-span-2" style="color:var(--gray-600)">{{ authStore.user?.email }}</div>
      </div>
    </div>

    <h2 class="text-lg font-bold mb-4" style="color:var(--gray-800)">Scegli il metodo di pagamento</h2>

    <div class="space-y-3 mb-6">
      <!-- Carta (Stripe) -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :style="selectedMethod === 'stripe' ? 'border-color:var(--navy)' : 'border-color:var(--gray-100)'"
        @click="selectedMethod = 'stripe'"
      >
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" :style="selectedMethod === 'stripe' ? 'border-color:var(--navy)' : 'border-color:var(--gray-200)'">
            <div v-if="selectedMethod === 'stripe'" class="w-2.5 h-2.5 rounded-full" style="background:var(--navy)" />
          </div>
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con Carta</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">MC</div>
          <div class="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">VISA</div>
          <div class="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">AMEX</div>
        </div>
      </label>

      <!-- PayPal -->
      <label
        class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
        :style="selectedMethod === 'paypal' ? 'border-color:var(--navy)' : 'border-color:var(--gray-100)'"
        @click="selectedMethod = 'paypal'"
      >
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" :style="selectedMethod === 'paypal' ? 'border-color:var(--navy)' : 'border-color:var(--gray-200)'">
            <div v-if="selectedMethod === 'paypal'" class="w-2.5 h-2.5 rounded-full" style="background:var(--navy)" />
          </div>
          <span class="text-sm font-medium" style="color:var(--gray-700)">Paga con PayPal</span>
        </div>
        <span class="font-bold text-sm"><span class="text-blue-700">Pay</span><span class="text-blue-400">Pal</span></span>
      </label>

      <!-- Paga in loco con carta a garanzia -->
      <div v-if="allowOffline">
        <label
          class="flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 cursor-pointer transition-all"
          :style="selectedMethod === 'offline' ? 'border-color:var(--navy)' : 'border-color:var(--gray-100)'"
          @click="selectedMethod = 'offline'; initGuarantee()"
        >
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" :style="selectedMethod === 'offline' ? 'border-color:var(--navy)' : 'border-color:var(--gray-200)'">
              <div v-if="selectedMethod === 'offline'" class="w-2.5 h-2.5 rounded-full" style="background:var(--navy)" />
            </div>
            <div>
              <span class="text-sm font-medium" style="color:var(--gray-700)">Paga in loco</span>
              <div class="text-xs mt-0.5" style="color:var(--gray-400)">Carta di credito richiesta come garanzia — non verrà addebitato nulla ora</div>
            </div>
          </div>
          <span class="text-2xl">🏢</span>
        </label>

        <!-- Stripe card element for guarantee -->
        <div v-if="selectedMethod === 'offline'" class="mt-3 bg-white border border-gray-200 rounded-xl p-5">
          <div v-if="guaranteeLoading" class="text-sm text-gray-400 text-center py-4">Caricamento modulo carta…</div>
          <div v-else-if="guaranteeReady">
            <p class="text-xs text-gray-400 mb-3">Inserisci i dati della carta. Verrà effettuata solo un'autorizzazione temporanea, non un addebito.</p>
            <div id="stripe-card-element" class="border border-gray-200 rounded-lg p-3 bg-gray-50" />
            <p v-if="cardError" class="text-red-600 text-xs mt-2">{{ cardError }}</p>
          </div>
          <div v-else class="text-xs text-red-500 text-center py-2">{{ guaranteeError }}</div>
        </div>
      </div>
    </div>

    <p v-if="checkoutError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{{ checkoutError }}</p>

    <button
      :disabled="!selectedMethod || checkoutLoading || (selectedMethod === 'offline' && !guaranteeReady)"
      class="w-full text-white font-bold py-4 rounded-xl disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
      style="background:var(--navy)"
      @click="confirmAndPay"
    >
      {{ checkoutLoading ? 'Conferma in corso…' : selectedMethod === 'offline' ? 'Autorizza Carta' : 'Conferma e Paga' }}
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const route     = useRoute();
const authStore = useAuthStore();
const config    = useRuntimeConfig();
const { initiateCheckout, initiatePayPalPayment } = useBookings();
const api       = useApi();

const bookingId       = route.query.booking_id as string;
const selectedMethod  = ref('stripe');
const checkoutLoading = ref(false);
const checkoutError   = ref<string | null>(null);
const allowOffline    = ref(false);

// Stripe card guarantee
const guaranteeLoading = ref(false);
const guaranteeReady   = ref(false);
const guaranteeError   = ref<string | null>(null);
const cardError        = ref<string | null>(null);
let stripeInstance: any = null;
let cardElement: any    = null;
let clientSecret        = '';

onMounted(async () => {
  if (!bookingId) return navigateTo('/booking');
  try {
    const s = await api<{ payment_mode: string }>('/tenants/pricing/');
    allowOffline.value = s.payment_mode === 'online_or_offline';
  } catch { /* keep false */ }
});

async function initGuarantee() {
  if (guaranteeReady.value || guaranteeLoading.value) return;
  guaranteeLoading.value = true;
  guaranteeError.value   = null;

  try {
    // Load Stripe.js
    if (!stripeInstance) {
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Stripe) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://js.stripe.com/v3/';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Stripe.js failed to load'));
        document.head.appendChild(s);
      });
      stripeInstance = (window as any).Stripe(config.public.stripePublishableKey);
    }

    // Create guarantee payment intent on backend
    const { client_secret } = await api<{ client_secret: string }>(
      `/payments/parking-guarantee/${bookingId}/`,
      { method: 'POST' }
    );
    clientSecret = client_secret;

    // Mount card element
    await nextTick();
    const elements = stripeInstance.elements();
    cardElement = elements.create('card', {
      style: { base: { fontSize: '15px', color: '#333', '::placeholder': { color: '#aaa' } } },
    });
    cardElement.mount('#stripe-card-element');
    cardElement.on('change', (e: any) => { cardError.value = e.error?.message ?? null; });
    guaranteeReady.value = true;
  } catch (e: any) {
    guaranteeError.value = e?.message ?? 'Errore nel caricamento del modulo carta.';
  } finally {
    guaranteeLoading.value = false;
  }
}

async function confirmAndPay() {
  if (!bookingId) return;
  checkoutLoading.value = true;
  checkoutError.value   = null;
  try {
    if (selectedMethod.value === 'stripe') {
      const url = await initiateCheckout(bookingId);
      if (url) navigateTo(url, { external: true });
      else checkoutError.value = 'Errore nell\'avvio del pagamento. Riprova.';
    } else if (selectedMethod.value === 'paypal') {
      const approveUrl = await initiatePayPalPayment(bookingId);
      if (approveUrl) navigateTo(approveUrl, { external: true });
      else checkoutError.value = 'Errore PayPal. Riprova.';
    } else if (selectedMethod.value === 'offline') {
      // Authorize card via Stripe (hold, no charge)
      const result = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      if (result.error) {
        checkoutError.value = result.error.message ?? 'Carta non autorizzata.';
        return;
      }
      // Confirm with backend
      await api(`/payments/parking-guarantee/${bookingId}/confirm/`, { method: 'POST' });
      navigateTo('/booking/success?offline=1');
    }
  } catch {
    checkoutError.value = 'Errore. Riprova.';
  } finally {
    checkoutLoading.value = false;
  }
}
</script>
