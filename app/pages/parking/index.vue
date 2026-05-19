<template>
  <div class="page">

    <!-- ── Navy search hero ─────────────────────────────────────── -->
    <div style="background:var(--navy-deep)" class="px-6 py-16">
      <div style="max-width:540px;margin:0 auto">

        <!-- hero tag -->
        <div class="text-center mb-8">
          <span class="hero-tag">Dal 1966 – Formia &amp; Gaeta</span>
        </div>

        <!-- Location selector -->
        <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-4">
          <svg width="18" height="18" class="shrink-0" style="color:var(--red)">
            <use href="#ic-pin" />
          </svg>
          <select
            v-model="query.location_id"
            class="flex-1 outline-none text-sm font-medium bg-transparent"
            style="color:var(--gray-800)"
          >
            <option value="">Seleziona parcheggio…</option>
            <option v-for="loc in parkingStore.locations" :key="loc.id" :value="loc.id">
              {{ loc.name }}
            </option>
          </select>
        </div>

        <!-- INGRESSO / USCITA -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-white rounded-xl p-4">
            <p class="text-center text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--gray-400)">
              Ingresso
            </p>
            <div class="flex items-center gap-2 mb-2">
              <svg width="16" height="16" class="shrink-0" style="color:var(--gray-400)"><use href="#ic-clock" /></svg>
              <input
                v-model="query.start_date"
                type="date"
                class="flex-1 text-sm outline-none min-w-0"
                style="color:var(--gray-600)"
                aria-label="Data ingresso"
              />
            </div>
            <div class="flex items-center gap-2">
              <svg width="16" height="16" class="shrink-0" style="color:var(--gray-400)"><use href="#ic-clock" /></svg>
              <input
                v-model="query.start_time"
                type="time"
                class="flex-1 text-sm outline-none min-w-0"
                style="color:var(--gray-600)"
                aria-label="Ora ingresso"
              />
            </div>
          </div>
          <div class="bg-white rounded-xl p-4">
            <p class="text-center text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--gray-400)">
              Uscita
            </p>
            <div class="flex items-center gap-2 mb-2">
              <svg width="16" height="16" class="shrink-0" style="color:var(--gray-400)"><use href="#ic-clock" /></svg>
              <input
                v-model="query.end_date"
                type="date"
                class="flex-1 text-sm outline-none min-w-0"
                style="color:var(--gray-600)"
                aria-label="Data uscita"
              />
            </div>
            <div class="flex items-center gap-2">
              <svg width="16" height="16" class="shrink-0" style="color:var(--gray-400)"><use href="#ic-clock" /></svg>
              <input
                v-model="query.end_time"
                type="time"
                class="flex-1 text-sm outline-none min-w-0"
                style="color:var(--gray-600)"
                aria-label="Ora uscita"
              />
            </div>
          </div>
        </div>

        <!-- Vehicle type selector -->
        <div class="grid grid-cols-4 gap-2 mb-5">
          <label
            v-for="vt in vehicleTypes"
            :key="vt.value"
            class="cursor-pointer"
          >
            <input type="radio" v-model="query.vehicle_type" :value="vt.value" class="sr-only" />
            <div
              class="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all"
              :class="query.vehicle_type === vt.value
                ? 'bg-white'
                : 'bg-white/10 hover:bg-white/20'"
            >
              <svg
                viewBox="0 0 24 24"
                class="w-7 h-7"
                fill="none"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                :style="query.vehicle_type === vt.value ? 'color:var(--navy-deep)' : 'color:rgba(255,255,255,0.7)'"
                v-html="vt.svgPath"
              />
              <span
                class="text-[10px] font-semibold uppercase tracking-wide"
                :style="query.vehicle_type === vt.value ? 'color:var(--navy-deep)' : 'color:rgba(255,255,255,0.6)'"
              >{{ vt.label }}</span>
            </div>
          </label>
        </div>

        <!-- CERCA button -->
        <button
          :disabled="!canSearch || parkingLoading"
          class="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-white transition-all disabled:opacity-40"
          style="background:var(--navy)"
          @click="doSearch"
        >
          {{ parkingLoading ? 'Ricerca in corso…' : 'Cerca' }}
        </button>

        <p v-if="parkingError" class="text-red-300 text-sm mt-3 text-center">{{ parkingError }}</p>
      </div>
    </div>

    <!-- ── Results ───────────────────────────────────────────────── -->
    <div v-if="searched" style="max-width:540px;margin:0 auto" class="px-6 py-10">

      <p v-if="groupedSpots.length === 0" class="text-center py-8" style="color:var(--gray-400)">
        Nessun posto disponibile per il periodo selezionato.
      </p>

      <div v-else>
        <div
          v-for="group in groupedSpots"
          :key="group.type"
          class="flex items-center gap-5 py-6 cursor-pointer transition-colors"
          style="border-bottom:1px solid var(--gray-100)"
          @click="selectGroup(group)"
        >
          <!-- Radio -->
          <div
            class="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
            :style="selectedType === group.type
              ? 'border-color:var(--navy)'
              : 'border-color:var(--gray-200)'"
          >
            <div
              v-if="selectedType === group.type"
              class="w-2.5 h-2.5 rounded-full"
              style="background:var(--navy)"
            />
          </div>

          <!-- Label -->
          <div class="w-36 shrink-0">
            <p class="text-xs font-bold uppercase tracking-wide" style="color:var(--gray-800)">
              {{ group.label }}
            </p>
          </div>

          <!-- Car icon -->
          <div class="flex-1 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              class="w-16 h-10"
              fill="none"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color:var(--gray-600)"
              v-html="group.svgPath"
            />
          </div>

          <!-- Price pill -->
          <div
            class="shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm text-white"
            style="background:#4CAF50"
          >
            € {{ group.price }}
            <span style="opacity:0.7">›</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Marquee ───────────────────────────────────────────────── -->
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee">
        <span v-for="(item, i) in marqueeLoop" :key="`${item}-${i}`">{{ item }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ParkingSpot } from '~/stores/parking';

definePageMeta({ middleware: 'auth' });

const parkingStore = useParkingStore();
const { fetchLocations, fetchAvailability, loading: parkingLoading, error: parkingError } = useParking();
const router = useRouter();
const route = useRoute();

const searched = ref(false);
const selectedType = ref('');

const query = reactive({
  location_id: (route.query.location_id as string) ?? '',
  start_date: '',
  start_time: '',
  end_date: '',
  end_time: '',
  vehicle_type: 'standard',
});

if (route.query.start_time) {
  const dt = route.query.start_time as string;
  query.start_date = dt.slice(0, 10);
  query.start_time = dt.slice(11, 16);
}
if (route.query.end_time) {
  const dt = route.query.end_time as string;
  query.end_date = dt.slice(0, 10);
  query.end_time = dt.slice(11, 16);
}

const CAR_SVG = `<path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle stroke="currentColor" cx="7" cy="17" r="2"/><circle stroke="currentColor" cx="17" cy="17" r="2"/><path stroke="currentColor" d="M14 17H10"/>`;
const TRUCK_SVG = `<rect stroke="currentColor" x="1" y="3" width="15" height="13"/><polygon stroke="currentColor" points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle stroke="currentColor" cx="5.5" cy="18.5" r="2.5"/><circle stroke="currentColor" cx="18.5" cy="18.5" r="2.5"/>`;
const MOTO_SVG = `<circle stroke="currentColor" cx="18" cy="17" r="3"/><circle stroke="currentColor" cx="6" cy="17" r="3"/><path stroke="currentColor" d="M9 17L8 11 14 8 16 14 18 14"/><path stroke="currentColor" d="M14 8L12 5 8 5"/>`;
const EV_SVG = `<path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle stroke="currentColor" cx="7" cy="17" r="2"/><circle stroke="currentColor" cx="17" cy="17" r="2"/><polygon stroke="currentColor" points="13 2 8 9 12 9 11 14 16 7 12 7 13 2"/>`;
const DISABLED_SVG = `<circle stroke="currentColor" cx="12" cy="4" r="1.5"/><path stroke="currentColor" d="M9 9l3-5 3 5"/><path stroke="currentColor" d="M6 14h9l2 4"/><path stroke="currentColor" d="M9 9v5"/><circle stroke="currentColor" cx="9" cy="20" r="2.5"/>`;

const vehicleTypes = [
  { value: 'standard', label: 'Auto', svgPath: CAR_SVG },
  { value: 'ev',       label: 'Elettrico', svgPath: EV_SVG },
  { value: 'vip',      label: 'VIP', svgPath: CAR_SVG },
  { value: 'camper',   label: 'Camper', svgPath: TRUCK_SVG },
];

const typeConfig: Record<string, { label: string; svgPath: string }> = {
  standard: { label: 'Coperto Auto Standard', svgPath: CAR_SVG },
  disabled: { label: 'Posto Accessibile',     svgPath: DISABLED_SVG },
  ev:       { label: 'Coperto Elettrico',      svgPath: EV_SVG },
  vip:      { label: 'Posto VIP',              svgPath: CAR_SVG },
  moto:     { label: 'Posto Moto',             svgPath: MOTO_SVG },
  camper:   { label: 'Posto Camper',           svgPath: TRUCK_SVG },
};

const marqueeLoop = [...marqueeItems, ...marqueeItems];

const PRICE_PER_HOUR = 5;

const durationHours = computed(() => {
  if (!query.start_date || !query.start_time || !query.end_date || !query.end_time) return 0;
  const start = new Date(`${query.start_date}T${query.start_time}`);
  const end   = new Date(`${query.end_date}T${query.end_time}`);
  return Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
});

const groupedSpots = computed(() => {
  const map = new Map<string, ParkingSpot[]>();
  for (const s of parkingStore.availableSpots) {
    if (!map.has(s.spot_type)) map.set(s.spot_type, []);
    map.get(s.spot_type)!.push(s);
  }
  const h = durationHours.value;
  return [...map.entries()].map(([type, spots]) => ({
    type,
    label:   typeConfig[type]?.label   ?? type,
    svgPath: typeConfig[type]?.svgPath ?? CAR_SVG,
    count:   spots.length,
    price:   (h * PRICE_PER_HOUR).toFixed(2).replace('.', ','),
    spots,
  }));
});

const canSearch = computed(() =>
  query.location_id && query.start_date && query.start_time && query.end_date && query.end_time
);

async function doSearch() {
  searched.value = false;
  selectedType.value = '';
  await fetchAvailability({
    location_id: query.location_id,
    start_time:  new Date(`${query.start_date}T${query.start_time}`).toISOString(),
    end_time:    new Date(`${query.end_date}T${query.end_time}`).toISOString(),
  });
  searched.value = true;
}

function selectGroup(group: { type: string; spots: ParkingSpot[] }) {
  selectedType.value = group.type;
  const spot = group.spots[0];
  if (!spot) return;
  router.push({
    path: '/booking',
    query: {
      spot_id:         spot.id,
      spot_identifier: spot.identifier,
      spot_type:       group.type,
      location_id:     query.location_id,
      start_time:      `${query.start_date}T${query.start_time}`,
      end_time:        `${query.end_date}T${query.end_time}`,
    },
  });
}

onMounted(async () => {
  await fetchLocations();
  if (canSearch.value) await doSearch();
});
</script>
