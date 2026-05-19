<template>
  <div>
    <!-- Location heading -->
    <h2 class="text-2xl font-bold mb-8" style="color:var(--navy-deep)">{{ locationName }}</h2>

    <!-- Personal info -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          v-model="form.first_name"
          type="text"
          placeholder="NOME"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
        <input
          v-model="form.last_name"
          type="text"
          placeholder="COGNOME"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
        <input
          v-model="form.telefono"
          type="tel"
          placeholder="TELEFONO"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="MAIL"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
        <input
          v-model="form.modello_veicolo"
          type="text"
          placeholder="MODELLO DEL VEICOLO"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
        <input
          v-model="form.targa"
          type="text"
          placeholder="TARGA"
          class="border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors uppercase tracking-wide font-medium"
          style="color:var(--gray-700)"
          @focus="e => (e.target as HTMLInputElement).style.borderColor='var(--navy)'"
          @blur="e => (e.target as HTMLInputElement).style.borderColor=''"
        />
      </div>
      <textarea
        v-model="form.messaggio"
        placeholder="MESSAGGIO"
        rows="3"
        class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none transition-colors resize-none uppercase tracking-wide font-medium"
        style="color:var(--gray-700)"
        @focus="e => (e.target as HTMLTextAreaElement).style.borderColor='var(--navy)'"
        @blur="e => (e.target as HTMLTextAreaElement).style.borderColor=''"
      />
      <label class="flex items-center gap-2 mt-4 cursor-pointer">
        <input v-model="form.privacy" type="checkbox" class="rounded border-gray-300" />
        <span class="text-xs" style="color:var(--gray-500)">Acconsento al trattamento dei dati</span>
      </label>
    </div>

    <!-- Riepilogo prenotazione -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h2 class="text-base font-bold mb-5" style="color:var(--gray-800)">Riepilogo prenotazione</h2>
      <div class="grid grid-cols-3 gap-4 items-start">
        <!-- Spot type -->
        <div class="text-center">
          <svg
            viewBox="0 0 24 24"
            class="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color:var(--navy)"
            v-html="spotSvg"
          />
          <div class="text-xs font-bold uppercase tracking-wide" style="color:var(--gray-700)">
            {{ spotLabel }}
          </div>
        </div>
        <!-- Entry -->
        <div>
          <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--gray-400)">Data Ingresso</div>
          <div class="flex items-center gap-1 text-sm mb-1" style="color:var(--gray-700)">
            <span>📅</span> {{ formatDate(startTime) }}
          </div>
          <div class="flex items-center gap-1 text-sm" style="color:var(--gray-700)">
            <span>🕐</span> {{ formatTime(startTime) }}
          </div>
        </div>
        <!-- Exit + price -->
        <div>
          <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--gray-400)">Data Uscita</div>
          <div class="flex items-center gap-1 text-sm mb-1" style="color:var(--gray-700)">
            <span>📅</span> {{ formatDate(endTime) }}
          </div>
          <div class="flex items-center gap-1 text-sm" style="color:var(--gray-700)">
            <span>🕐</span> {{ formatTime(endTime) }}
          </div>
          <div class="mt-3">
            <div class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--gray-400)">Paga Online</div>
            <div class="inline-flex items-center gap-1 text-white font-bold text-sm px-3 py-1.5 rounded-lg" style="background:#4CAF50">
              € {{ estimatedPrice }} <span style="opacity:0.7">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orario di apertura -->
    <div class="py-4 mb-2" style="border-top:1px solid var(--gray-100)">
      <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--gray-500)">Orario di Apertura</div>
      <p class="text-xs leading-relaxed" style="color:var(--gray-500)">
        Dal Lunedì al Sabato dalle 06:00 all'1:00. Domenica e festivi dalle 06:00 alle 10:00 e dalle 18:00 all'1:00.
      </p>
      <label class="flex items-center gap-2 mt-3 cursor-pointer">
        <input v-model="form.orario_preso_nota" type="checkbox" class="rounded border-gray-300" />
        <span class="text-xs" style="color:var(--gray-500)">Ho preso nota dell'orario ridotto del parcheggio.</span>
      </label>
    </div>

    <!-- Altre informazioni (chiavi) -->
    <div class="py-4 mb-2" style="border-top:1px solid var(--gray-100)">
      <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--gray-500)">Altre Informazioni</div>
      <p class="text-xs leading-relaxed" style="color:var(--gray-500)">
        Le chiavi del veicolo devono essere consegnate agli addetti.
      </p>
      <label class="flex items-center gap-2 mt-3 cursor-pointer">
        <input v-model="form.chiavi_preso_nota" type="checkbox" class="rounded border-gray-300" />
        <span class="text-xs" style="color:var(--gray-500)">Ho preso nota dell'orario ridotto del parcheggio.</span>
      </label>
    </div>

    <!-- Fattura -->
    <div class="py-4 mb-6" style="border-top:1px solid var(--gray-100)">
      <div class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--gray-500)">Altre Informazioni</div>
      <label class="flex items-center gap-2 cursor-pointer">
        <input v-model="form.fattura" type="checkbox" class="rounded border-gray-300" />
        <span class="text-xs" style="color:var(--gray-500)">Richiedi fattura</span>
      </label>
    </div>

    <div v-if="bookingError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">
      {{ bookingError }}
    </div>

    <!-- Confirm button -->
    <button
      :disabled="bookingLoading || !form.privacy"
      class="w-full text-white font-bold py-4 rounded-xl disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
      style="background:#4CAF50"
      @mouseenter="e => { if (!bookingLoading && form.privacy) (e.currentTarget as HTMLElement).style.background='#43A047' }"
      @mouseleave="e => (e.currentTarget as HTMLElement).style.background='#4CAF50'"
      @click="confirmBooking"
    >
      {{ bookingLoading ? 'Creazione prenotazione…' : 'Conferma' }}
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
const { createBooking, loading: bookingLoading, error: bookingError } = useBookings();

const form = reactive({
  first_name:       authStore.user?.first_name ?? '',
  last_name:        authStore.user?.last_name  ?? '',
  email:            authStore.user?.email      ?? '',
  telefono:         '',
  modello_veicolo:  '',
  targa:            '',
  messaggio:        '',
  privacy:          false,
  orario_preso_nota: false,
  chiavi_preso_nota: false,
  fattura:          false,
});

const locationName = computed(
  () => parkingStore.locations.find(l => l.id === props.locationId)?.name ?? 'Parcheggio'
);

const CAR_SVG = `<path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle stroke="currentColor" cx="7" cy="17" r="2"/><circle stroke="currentColor" cx="17" cy="17" r="2"/><path stroke="currentColor" d="M14 17H10"/>`;
const TRUCK_SVG = `<rect stroke="currentColor" x="1" y="3" width="15" height="13"/><polygon stroke="currentColor" points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle stroke="currentColor" cx="5.5" cy="18.5" r="2.5"/><circle stroke="currentColor" cx="18.5" cy="18.5" r="2.5"/>`;

const typeConfig: Record<string, { label: string; svg: string }> = {
  standard: { label: 'Coperto Auto Standard', svg: CAR_SVG },
  disabled: { label: 'Posto Accessibile',     svg: CAR_SVG },
  ev:       { label: 'Coperto Elettrico',      svg: CAR_SVG },
  vip:      { label: 'Posto VIP',              svg: CAR_SVG },
  moto:     { label: 'Posto Moto',             svg: CAR_SVG },
  camper:   { label: 'Posto Camper',           svg: TRUCK_SVG },
};

const spotLabel = computed(() => typeConfig[props.spotType]?.label ?? props.spotIdentifier);
const spotSvg   = computed(() => typeConfig[props.spotType]?.svg   ?? CAR_SVG);

const PRICE_PER_HOUR = 5;
const estimatedPrice = computed(() => {
  const start = new Date(props.startTime);
  const end   = new Date(props.endTime);
  const hours = Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
  return (hours * PRICE_PER_HOUR).toFixed(2).replace('.', ',');
});

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

async function confirmBooking() {
  const booking = await createBooking({
    spot:       props.spotId,
    vehicle:    null,
    start_time: new Date(props.startTime).toISOString(),
    end_time:   new Date(props.endTime).toISOString(),
  });
  if (!booking) return;
  emit('confirmed');
  navigateTo(`/booking/payment?booking_id=${booking.id}`);
}
</script>
