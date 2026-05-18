<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <div class="sec-label mb-2">Disponibilità</div>
    <h1 class="sec-title mb-10">Trova il tuo posto</h1>

    <!-- Location -->
    <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 mb-5">
      <svg width="18" height="18" class="shrink-0" style="color:var(--red)"><use href="#ic-pin" /></svg>
      <select
        v-model="query.location_id"
        class="flex-1 outline-none text-sm text-gray-700 font-medium bg-transparent"
      >
        <option value="">Seleziona parcheggio…</option>
        <option v-for="loc in parkingStore.locations" :key="loc.id" :value="loc.id">
          {{ loc.name }}
        </option>
      </select>
    </div>

    <!-- Date/time -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div>
        <div class="text-xs font-bold text-center text-gray-400 uppercase tracking-widest mb-3">Ingresso</div>
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-2">
          <span class="text-gray-400 text-sm shrink-0">📅</span>
          <input v-model="query.start_date" type="date" class="flex-1 text-sm outline-none text-gray-600 min-w-0" />
        </div>
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <span class="text-gray-400 text-sm shrink-0">🕐</span>
          <input v-model="query.start_time" type="time" class="flex-1 text-sm outline-none text-gray-600 min-w-0" />
        </div>
      </div>
      <div>
        <div class="text-xs font-bold text-center text-gray-400 uppercase tracking-widest mb-3">Uscita</div>
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-2">
          <span class="text-gray-400 text-sm shrink-0">📅</span>
          <input v-model="query.end_date" type="date" class="flex-1 text-sm outline-none text-gray-600 min-w-0" />
        </div>
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <span class="text-gray-400 text-sm shrink-0">🕐</span>
          <input v-model="query.end_time" type="time" class="flex-1 text-sm outline-none text-gray-600 min-w-0" />
        </div>
      </div>
    </div>

    <!-- Vehicle type -->
    <div class="flex justify-around bg-white border border-gray-200 rounded-xl px-4 py-4 mb-5">
      <label v-for="vt in vehicleTypes" :key="vt.value" class="cursor-pointer">
        <input type="radio" v-model="query.vehicle_type" :value="vt.value" class="sr-only" />
        <div
          class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all"
          :class="query.vehicle_type === vt.value ? 'border-navy bg-navy/5' : 'border-gray-200 opacity-40'"
        >
          {{ vt.icon }}
        </div>
      </label>
    </div>

    <p v-if="parkingError" class="text-brand-red text-sm mb-4">{{ parkingError }}</p>

    <button
      :disabled="!canSearch || parkingLoading"
      class="btn btn-navy w-full justify-center mb-10"
      @click="doSearch"
    >
      {{ parkingLoading ? "Calcolo in corso…" : "Controlla disponibilità" }}
    </button>

    <!-- Results -->
    <div v-if="searched">
      <div
        v-for="(group, idx) in groupedSpots"
        :key="group.type"
        class="flex items-center gap-4 py-5 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl px-2"
        :class="{ 'bg-navy/5': selectedType === group.type }"
        @click="selectGroup(group)"
      >
        <div
          class="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
          :class="selectedType === group.type ? 'border-navy' : 'border-gray-300'"
        >
          <div v-if="selectedType === group.type" class="w-2.5 h-2.5 rounded-full bg-navy" />
        </div>

        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-16 h-12 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center text-3xl border border-gray-100">
            {{ group.icon }}
          </div>
          <div class="min-w-0">
            <div class="font-bold text-gray-800 text-sm uppercase tracking-wide truncate">{{ group.label }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ group.count }} posto/i disponibile/i</div>
          </div>
        </div>

        <div
          class="shrink-0 flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm text-white transition-colors"
          :class="selectedType === group.type ? 'bg-navy-deep' : 'bg-navy'"
        >
          <span v-if="idx === 0" class="line-through text-white/40 text-xs mr-1">
            €{{ (parseFloat(group.price.replace(",", ".")) * 1.15).toFixed(2).replace(".", ",") }}
          </span>
          € {{ group.price }}
          <span class="text-white/50 ml-0.5">›</span>
        </div>
      </div>

      <div v-if="groupedSpots.length === 0" class="py-12 text-center text-gray-400">
        Nessun posto disponibile per il periodo selezionato.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParkingSpot } from "~/stores/parking";

definePageMeta({ middleware: "auth" });

const parkingStore = useParkingStore();
const { fetchLocations, fetchAvailability, loading: parkingLoading, error: parkingError } = useParking();
const router = useRouter();
const route = useRoute();

const searched = ref(false);
const selectedType = ref("");

const query = reactive({
  location_id: (route.query.location_id as string) ?? "",
  start_date: "",
  start_time: "",
  end_date: "",
  end_time: "",
  vehicle_type: "standard",
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

const vehicleTypes = [
  { value: "standard", icon: "🚗" },
  { value: "disabled", icon: "♿" },
  { value: "ev", icon: "⚡" },
  { value: "vip", icon: "⭐" },
];

const typeConfig: Record<string, { label: string; icon: string }> = {
  standard: { label: "Coperto Auto Standard", icon: "🚗" },
  disabled: { label: "Posto Accessibile", icon: "♿" },
  ev: { label: "Coperto Elettrico", icon: "⚡" },
  vip: { label: "Posto VIP Premium", icon: "⭐" },
};

const PRICE_PER_HOUR = 5;

const durationHours = computed(() => {
  if (!query.start_date || !query.start_time || !query.end_date || !query.end_time) return 0;
  const start = new Date(`${query.start_date}T${query.start_time}`);
  const end = new Date(`${query.end_date}T${query.end_time}`);
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
    label: typeConfig[type]?.label ?? type,
    icon: typeConfig[type]?.icon ?? "🅿",
    count: spots.length,
    price: (h * PRICE_PER_HOUR).toFixed(2).replace(".", ","),
    spots,
  }));
});

const canSearch = computed(
  () => query.location_id && query.start_date && query.start_time && query.end_date && query.end_time
);

async function doSearch() {
  searched.value = false;
  selectedType.value = "";
  await fetchAvailability({
    location_id: query.location_id,
    start_time: new Date(`${query.start_date}T${query.start_time}`).toISOString(),
    end_time: new Date(`${query.end_date}T${query.end_time}`).toISOString(),
  });
  searched.value = true;
}

function selectGroup(group: { type: string; spots: ParkingSpot[] }) {
  selectedType.value = group.type;
  const spot = group.spots[0];
  if (!spot) return;
  router.push({
    path: "/booking",
    query: {
      spot_id: spot.id,
      spot_identifier: spot.identifier,
      spot_type: group.type,
      location_id: query.location_id,
      start_time: `${query.start_date}T${query.start_time}`,
      end_time: `${query.end_date}T${query.end_time}`,
    },
  });
}

onMounted(async () => {
  await fetchLocations();
  if (canSearch.value) await doSearch();
});
</script>
