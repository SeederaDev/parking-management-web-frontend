<template>
  <div>
    <!-- Location heading -->
    <h1 class="text-2xl font-bold text-indigo-600 mb-8">{{ locationName }}</h1>

    <!-- Personal info card -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          v-model="form.first_name"
          type="text"
          placeholder="NOME"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
        <input
          v-model="form.last_name"
          type="text"
          placeholder="COGNOME"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
        <input
          v-model="form.telefono"
          type="tel"
          placeholder="TELEFONO"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="MAIL"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
        <input
          v-model="form.modello_veicolo"
          type="text"
          placeholder="MODELLO DEL VEICOLO"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
        <input
          v-model="form.targa"
          type="text"
          placeholder="TARGA"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors uppercase tracking-wide font-medium"
        />
      </div>
      <textarea
        v-model="form.messaggio"
        placeholder="MESSAGGIO"
        rows="3"
        class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors resize-none uppercase tracking-wide font-medium"
      />
      <label class="flex items-center gap-2 mt-4 cursor-pointer">
        <input
          v-model="form.privacy"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="text-xs text-gray-500"
          >Acconsento al trattamento dei dati</span
        >
      </label>
    </div>

    <!-- Riepilogo prenotazione -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h2 class="text-base font-bold text-gray-800 mb-5">
        Riepilogo prenotazione
      </h2>
      <div class="grid grid-cols-3 gap-4 items-start">
        <!-- Spot type -->
        <div class="text-center">
          <div class="text-3xl mb-2">{{ spotIcon }}</div>
          <div class="text-xs font-bold text-gray-700 uppercase tracking-wide">
            {{ spotLabel }}
          </div>
        </div>
        <!-- Entry -->
        <div>
          <div
            class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
          >
            Data Ingresso
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-700 mb-1">
            <span>📅</span> {{ formatDate(startTime) }}
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-700">
            <span>🕐</span> {{ formatTime(startTime) }}
          </div>
        </div>
        <!-- Exit + price -->
        <div>
          <div
            class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
          >
            Data Uscita
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-700 mb-1">
            <span>📅</span> {{ formatDate(endTime) }}
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-700">
            <span>🕐</span> {{ formatTime(endTime) }}
          </div>
          <div class="mt-3">
            <div
              class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"
            >
              Paga Online
            </div>
            <div
              class="inline-flex items-center gap-1 bg-indigo-600 text-white font-bold text-sm px-3 py-1.5 rounded-lg"
            >
              € {{ estimatedPrice }}
              <span class="text-indigo-300">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Opening hours -->
    <div class="border-t border-gray-100 py-4 mb-2">
      <div
        class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
      >
        Orario di Apertura
      </div>
      <p class="text-xs text-gray-500 leading-relaxed">
        Dal Lunedì al Sabato dalle 06:00 all'1:00. Domenica e festivi dalle
        06:00 alle 10:00 e dalle 18:00 all'1:00. Dal 09 al 31 agosto il
        parcheggio sarà aperto dalle 06:00 alle 10:00 e dalle 18:00 alle 01:00.
      </p>
      <label class="flex items-center gap-2 mt-3 cursor-pointer">
        <input
          v-model="form.orario_preso_nota"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="text-xs text-gray-500"
          >Ho preso nota dell'orario ridotto del parcheggio.</span
        >
      </label>
    </div>

    <!-- Extra info -->
    <div class="border-t border-gray-100 py-4 mb-2">
      <div
        class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
      >
        Altre Informazioni
      </div>
      <p class="text-xs text-gray-500 leading-relaxed">
        Le chiavi del veicolo devono essere consegnate agli addetti.
      </p>
      <label class="flex items-center gap-2 mt-3 cursor-pointer">
        <input
          v-model="form.chiavi_preso_nota"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="text-xs text-gray-500"
          >Ho preso nota dell'orario ridotto del parcheggio.</span
        >
      </label>
    </div>

    <div class="border-t border-gray-100 py-4 mb-6">
      <div
        class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
      >
        Altre Informazioni
      </div>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.fattura"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="text-xs text-gray-500">Richiedi fattura</span>
      </label>
    </div>

    <div
      v-if="bookingError"
      class="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4"
    >
      {{ bookingError }}
    </div>

    <!-- Confirm button -->
    <button
      :disabled="bookingLoading || !form.privacy"
      class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
      @click="confirmBooking"
    >
      {{ bookingLoading ? "Creazione prenotazione…" : "Conferma" }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  spotId: string;
  spotIdentifier: string;
  spotType: string;
  locationId: string;
  startTime: string;
  endTime: string;
}>();

const emit = defineEmits<{ confirmed: [] }>();

const authStore = useAuthStore();
const parkingStore = useParkingStore();
const {
  createBooking,
  loading: bookingLoading,
  error: bookingError,
} = useBookings();

const form = reactive({
  first_name: authStore.user?.first_name ?? "",
  last_name: authStore.user?.last_name ?? "",
  email: authStore.user?.email ?? "",
  telefono: "",
  modello_veicolo: "",
  targa: "",
  messaggio: "",
  privacy: false,
  orario_preso_nota: false,
  chiavi_preso_nota: false,
  fattura: false,
});

const locationName = computed(
  () =>
    parkingStore.locations.find((l) => l.id === props.locationId)?.name ??
    "Parcheggio"
);

const typeConfig: Record<string, { label: string; icon: string }> = {
  standard: { label: "Coperto Auto Standard", icon: "🚗" },
  disabled: { label: "Posto Accessibile", icon: "♿" },
  ev: { label: "Coperto Elettrico", icon: "⚡" },
  vip: { label: "Posto VIP Premium", icon: "⭐" },
};

const spotLabel = computed(
  () => typeConfig[props.spotType]?.label ?? props.spotIdentifier
);
const spotIcon = computed(() => typeConfig[props.spotType]?.icon ?? "🅿");

const PRICE_PER_HOUR = 5;
const estimatedPrice = computed(() => {
  const start = new Date(props.startTime);
  const end = new Date(props.endTime);
  const hours = Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
  return (hours * PRICE_PER_HOUR).toFixed(2).replace(".", ",");
});

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function confirmBooking() {
  const booking = await createBooking({
    spot: props.spotId,
    vehicle: null,
    start_time: new Date(props.startTime).toISOString(),
    end_time: new Date(props.endTime).toISOString(),
  });
  if (!booking) return;
  emit("confirmed");
  navigateTo(`/booking/payment?booking_id=${booking.id}`);
}
</script>


onMounted(() => fetchVehicles(true));
</script>
