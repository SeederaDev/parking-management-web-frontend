<template>
  <div class="max-w-xl">
    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div v-if="loading && !settings" class="text-center py-16 text-sm text-gray-400">Caricamento…</div>

      <template v-else-if="settings">
        <div v-if="successMsg" class="mb-6 bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm font-medium">{{ successMsg }}</div>
        <div v-if="error" class="mb-6 bg-red-50 text-brand-red rounded-xl p-4 text-sm">{{ error }}</div>

        <form class="space-y-8" @submit.prevent="save">

          <!-- Pricing -->
          <div class="space-y-4">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">Tariffe</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Tariffa oraria (€/h)</label>
                <input
                  v-model="form.hourly_rate"
                  type="number" step="0.01" min="0" required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Tariffa giornaliera (€/giorno)</label>
                <input
                  v-model="form.daily_rate"
                  type="number" step="0.01" min="0" required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
              </div>
            </div>
            <label class="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.apply_daily_rate" type="checkbox" class="rounded border-gray-300 text-navy" />
              <span>Applica tariffa giornaliera <span class="text-gray-400">(quando più conveniente)</span></span>
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.enable_hourly_booking" type="checkbox" class="rounded border-gray-300 text-navy" />
              <span>Abilita prenotazioni orarie <span class="text-gray-400">(altrimenti solo giornate intere)</span></span>
            </label>
          </div>

          <!-- Cancellation -->
          <div class="space-y-4">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">Rimborsi e annullamenti</p>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">Ore minime per il rimborso</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="form.cancellation_cutoff_hours"
                  type="number" min="0" required
                  class="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
                <span class="text-sm text-gray-400">ore prima dell'inizio</span>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">Metodo di pagamento</p>
            <label class="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.payment_mode" type="radio" value="online_only" class="text-navy" />
              Solo online (Stripe / PayPal)
            </label>
            <label class="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.payment_mode" type="radio" value="online_or_offline" class="text-navy" />
              Online oppure offline (contante / POS)
            </label>
          </div>

          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
            style="background:var(--navy)"
            @mouseenter="e => { if (!saving) (e.currentTarget as HTMLElement).style.background='var(--navy-deep)' }"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--navy)'"
          >
            {{ saving ? "Salvataggio…" : "Salva" }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMode } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { settings, loading, saving, error, fetchSettings, updateSettings } = useTenantSettings();
const successMsg = ref<string | null>(null);

const form = reactive({
  hourly_rate: "0.00",
  daily_rate: "0.00",
  apply_daily_rate: true,
  enable_hourly_booking: true,
  cancellation_cutoff_hours: 24,
  payment_mode: "online_only" as PaymentMode,
});

watch(settings, (val) => {
  if (!val) return;
  form.hourly_rate = val.hourly_rate;
  form.daily_rate = val.daily_rate;
  form.apply_daily_rate = val.apply_daily_rate;
  form.enable_hourly_booking = val.enable_hourly_booking;
  form.cancellation_cutoff_hours = val.cancellation_cutoff_hours;
  form.payment_mode = val.payment_mode;
}, { immediate: true });

async function save() {
  successMsg.value = null;
  const result = await updateSettings({ ...form });
  if (result) {
    successMsg.value = "Impostazioni salvate.";
    setTimeout(() => { successMsg.value = null; }, 3000);
  }
}

onMounted(fetchSettings);
</script>
