import type { ParkingSpot } from "~/types";
import { nextTick } from "vue";

const PRICE_PER_DAY = 15;

export const bookingVehicleTypes = [
  { value: "standard", label: "Auto",        icon: "🚗" },
  { value: "disabled", label: "Accessibile", icon: "♿" },
  { value: "ev",       label: "Elettrico",   icon: "⚡" },
  { value: "vip",      label: "VIP",         icon: "⭐" },
];

export const spotTypeLabels: Record<string, string> = {
  standard: "Coperto Auto Standard",
  disabled: "Posto Accessibile",
  ev:       "Coperto Elettrico",
  vip:      "Posto VIP",
  moto:     "Posto Moto",
  camper:   "Posto Camper",
};

export const useBookingSearch = () => {
  const parkingStore = useParkingStore();
  const router       = useRouter();
  const {
    fetchLocations,
    fetchAvailability,
    loading: searching,
    error:   searchError,
  } = useParking();

  const locations    = computed(() => parkingStore.locations);
  const searched     = ref(false);
  const selectedType = ref("");

  const search = reactive({
    location_id:  "",
    start_date:   "",
    end_date:     "",
    vehicle_type: "standard",
  });

  watch(locations, (locs) => {
    const first = locs[0];
    if (first && !search.location_id) {
      search.location_id = String(first.id);
    }
  }, { immediate: true });

  const canSearch = computed(() =>
    !!(search.location_id && search.start_date && search.end_date)
  );

  const durationDays = computed(() => {
    if (!search.start_date || !search.end_date) return 0;
    const start = new Date(search.start_date);
    const end   = new Date(search.end_date);
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  });

  const groupedSpots = computed(() => {
    const map = new Map<string, ParkingSpot[]>();
    for (const s of parkingStore.availableSpots) {
      if (!map.has(s.spot_type)) map.set(s.spot_type, []);
      map.get(s.spot_type)!.push(s);
    }
    const d = durationDays.value;
    return [...map.entries()].map(([type, spots]) => ({
      type,
      label: spotTypeLabels[type] ?? type,
      count: spots.length,
      price: (d * PRICE_PER_DAY).toFixed(2).replace(".", ","),
      spots,
    }));
  });

  async function doSearch(scrollTargetId?: string) {
    if (!search.location_id) return;

    if (!search.start_date) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      search.start_date = d.toISOString().slice(0, 10);
    }
    if (!search.end_date) {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      search.end_date = d.toISOString().slice(0, 10);
    }

    searched.value = false;
    selectedType.value = "";
    parkingStore.setAvailableSpots([]);

    await fetchAvailability({
      location_id: search.location_id,
      start_time:  `${search.start_date}T00:00:00`,
      end_time:    `${search.end_date}T00:00:00`,
    });

    searched.value = true;
    if (scrollTargetId) {
      await nextTick();
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function selectGroup(group: { type: string; spots: ParkingSpot[] }) {
    selectedType.value = group.type;
    const spot = group.spots[0];
    if (!spot) return;
    router.push({
      path: "/booking",
      query: {
        spot_id:         spot.id,
        spot_identifier: spot.identifier,
        spot_type:       group.type,
        location_id:     search.location_id,
        start_time:      `${search.start_date}T00:00:00`,
        end_time:        `${search.end_date}T00:00:00`,
      },
    });
  }

  onMounted(() => fetchLocations());

  return {
    locations,
    search,
    canSearch,
    groupedSpots,
    searching,
    searchError,
    searched,
    selectedType,
    doSearch,
    selectGroup,
  };
};
