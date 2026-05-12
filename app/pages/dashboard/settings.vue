<template>
  <div class="max-w-2xl">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div v-if="loading && !settings" class="text-center py-16 text-gray-400">
        Caricamento…
      </div>

      <template v-else-if="settings">
        <div
          v-if="successMsg"
          class="mb-5 bg-green-50 text-green-800 rounded-xl p-3 text-sm"
        >
          {{ successMsg }}
        </div>
        <div
          v-if="error"
          class="mb-5 bg-red-50 text-red-800 rounded-xl p-3 text-sm"
        >
          {{ error }}
        </div>

        <form class="space-y-6" @submit.prevent="save">
          <!-- Pricing -->
          <fieldset class="space-y-4">
            <legend
              class="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 w-full"
            >
              💶 Tariffe
            </legend>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1"
                  >Tariffa oraria (€/h)</label
                >
                <input
                  v-model="form.hourly_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1"
                  >Tariffa giornaliera (€/giorno)</label
                >
                <input
                  v-model="form.daily_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <label class="flex items-center gap-3 text-sm text-gray-700">
              <input
                v-model="form.apply_daily_rate"
                type="checkbox"
                class="rounded text-indigo-600"
              />
              <span>
                <span class="font-medium">Applica tariffa giornaliera</span>
                <span class="text-gray-400 ml-1"
                  >(usa la tariffa al giorno quando più conveniente)</span
                >
              </span>
            </label>

            <label class="flex items-center gap-3 text-sm text-gray-700">
              <input
                v-model="form.enable_hourly_booking"
                type="checkbox"
                class="rounded text-indigo-600"
              />
              <span>
                <span class="font-medium">Abilita prenotazioni orarie</span>
                <span class="text-gray-400 ml-1"
                  >(se disabilitato i clienti prenotano solo giornate
                  intere)</span
                >
              </span>
            </label>
          </fieldset>

          <!-- Cancellation -->
          <fieldset class="space-y-4">
            <legend
              class="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 w-full"
            >
              🔄 Rimborsi & annullamenti
            </legend>
            <div>
              <label class="block text-xs text-gray-500 mb-1"
                >Ore minime prima della prenotazione per il rimborso</label
              >
              <input
                v-model.number="form.cancellation_cutoff_hours"
                type="number"
                min="0"
                required
                class="w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <p class="text-xs text-gray-400 mt-1">
                Il rimborso è automatico solo se mancano almeno N ore all'inizio
                della prenotazione.
              </p>
            </div>
          </fieldset>

          <!-- Payment mode -->
          <fieldset class="space-y-3">
            <legend
              class="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100 w-full"
            >
              💳 Modalità di pagamento accettate
            </legend>
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input
                v-model="form.payment_mode"
                type="radio"
                value="online_only"
              />
              Solo online (Stripe / PayPal)
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input
                v-model="form.payment_mode"
                type="radio"
                value="online_or_offline"
              />
              Online oppure offline (contante / POS)
            </label>
          </fieldset>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {{ saving ? "Salvataggio…" : "Salva impostazioni" }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMode } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { settings, loading, saving, error, fetchSettings, updateSettings } =
  useTenantSettings();
const successMsg = ref<string | null>(null);

const form = reactive({
  hourly_rate: "0.00",
  daily_rate: "0.00",
  apply_daily_rate: true,
  enable_hourly_booking: true,
  cancellation_cutoff_hours: 24,
  payment_mode: "online_only" as PaymentMode,
});

watch(
  settings,
  (val) => {
    if (!val) return;
    form.hourly_rate = val.hourly_rate;
    form.daily_rate = val.daily_rate;
    form.apply_daily_rate = val.apply_daily_rate;
    form.enable_hourly_booking = val.enable_hourly_booking;
    form.cancellation_cutoff_hours = val.cancellation_cutoff_hours;
    form.payment_mode = val.payment_mode;
  },
  { immediate: true }
);

async function save() {
  successMsg.value = null;
  const result = await updateSettings({ ...form });
  if (result) {
    successMsg.value = "Impostazioni salvate con successo!";
    setTimeout(() => {
      successMsg.value = null;
    }, 3000);
  }
}

onMounted(fetchSettings);
</script>
