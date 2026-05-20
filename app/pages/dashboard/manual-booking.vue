<template>
  <div class="max-w-xl">
    <div class="bg-white rounded-xl border border-gray-100 p-6">

      <div v-if="success" class="mb-6 bg-emerald-50 text-emerald-800 rounded-xl p-4 text-sm font-medium">
        Prenotazione creata con successo.
        <NuxtLink to="/dashboard/bookings" class="underline ml-1">Vedi prenotazioni →</NuxtLink>
      </div>
      <div v-if="error" class="mb-6 bg-red-50 text-brand-red rounded-xl p-4 text-sm">{{ error }}</div>

      <form class="space-y-5" @submit.prevent="submit">

        <!-- Customer email -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email cliente</label>
          <input
            v-model="form.userEmail"
            type="email"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
          <p v-if="resolvedUser" class="mt-1.5 text-xs font-semibold text-emerald-600">
            ✓ {{ resolvedUser.first_name }} {{ resolvedUser.last_name }}
          </p>
        </div>

        <!-- Location + spot -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sede</label>
            <select
              v-model="selectedLocation"
              required
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              @change="form.spot = ''"
            >
              <option value="">Seleziona…</option>
              <option v-for="loc in parkingStore.locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">ID Posto</label>
            <input
              v-model="form.spot"
              type="text"
              required
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Inizio</label>
            <input
              v-model="form.start_time"
              type="datetime-local"
              required
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fine</label>
            <input
              v-model="form.end_time"
              type="datetime-local"
              required
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
        </div>

        <!-- Payment type -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pagamento</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.payment_type" type="radio" value="offline" class="text-navy" />
              Offline / contante
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.payment_type" type="radio" value="online" class="text-navy" />
              Online
            </label>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Note</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          style="background:var(--navy)"
          @mouseenter="e => { if (!loading) (e.currentTarget as HTMLElement).style.background='var(--navy-deep)' }"
          @mouseleave="e => (e.currentTarget as HTMLElement).style.background='var(--navy)'"
        >
          {{ loading ? "Creazione…" : "Crea prenotazione" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentType } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const api = useApi();
const parkingStore = useParkingStore();
const { loading, error, createManualBooking } = useAdminBookings();
const { fetchLocations } = useParking();

const success = ref(false);
const selectedLocation = ref("");
const resolvedUser = ref<{ id: string; first_name: string; last_name: string } | null>(null);

const form = reactive({
  userEmail: "",
  spot: "",
  start_time: "",
  end_time: "",
  payment_type: "offline" as PaymentType,
  notes: "",
});

let emailTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => form.userEmail,
  (val) => {
    resolvedUser.value = null;
    if (!val.includes("@")) return;
    if (emailTimer) clearTimeout(emailTimer);
    emailTimer = setTimeout(async () => {
      try {
        const users = await api<{ results: Array<{ id: string; email: string; first_name: string; last_name: string }> }>(
          `/admin/customers/?search=${encodeURIComponent(val)}`
        );
        const match = users.results.find(u => u.email === val);
        if (match) resolvedUser.value = match;
      } catch {}
    }, 400);
  }
);

async function submit() {
  success.value = false;
  if (!resolvedUser.value) {
    try {
      const users = await api<{ results: Array<{ id: string; email: string; first_name: string; last_name: string }> }>(
        `/admin/customers/?search=${encodeURIComponent(form.userEmail)}`
      );
      const match = users.results.find(u => u.email === form.userEmail);
      if (!match) { error.value = "Cliente non trovato con questa email."; return; }
      resolvedUser.value = match;
    } catch {
      error.value = "Impossibile trovare il cliente.";
      return;
    }
  }
  const booking = await createManualBooking({
    user: resolvedUser.value!.id,
    spot: form.spot,
    start_time: new Date(form.start_time).toISOString(),
    end_time: new Date(form.end_time).toISOString(),
    payment_type: form.payment_type,
    notes: form.notes,
  });
  if (booking) {
    success.value = true;
    form.userEmail = "";
    form.spot = "";
    form.start_time = "";
    form.end_time = "";
    form.notes = "";
    resolvedUser.value = null;
  }
}

onMounted(fetchLocations);
</script>
