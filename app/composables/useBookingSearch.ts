import type { ParkingSpot } from "~/types";
import { nextTick } from "vue";

const PRICE_PER_HOUR = 5;

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
  const authStore    = useAuthStore();
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
    start_time:   "",
    end_date:     "",
    end_time:     "",
    vehicle_type: "standard",
  });

  const canSearch = computed(() =>
    !!(search.location_id &&
       search.start_date && search.start_time &&
       search.end_date   && search.end_time)
  );

  const durationHours = computed(() => {
    if (!canSearch.value) return 0;
    const start = new Date(`${search.start_date}T${search.start_time}`);
    const end   = new Date(`${search.end_date}T${search.end_time}`);
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
      label: spotTypeLabels[type] ?? type,
      count: spots.length,
      price: (h * PRICE_PER_HOUR).toFixed(2).replace(".", ","),
      spots,
    }));
  });

  async function doSearch(scrollTargetId?: string) {
    if (!canSearch.value) return;
    if (!authStore.isAuthenticated) {
      router.push("/login");
      return;
    }
    searched.value = false;
    selectedType.value = "";
    parkingStore.setAvailableSpots([]);

    await fetchAvailability({
      location_id: search.location_id,
      start_time:  new Date(`${search.start_date}T${search.start_time}`).toISOString(),
      end_time:    new Date(`${search.end_date}T${search.end_time}`).toISOString(),
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
        start_time:      `${search.start_date}T${search.start_time}`,
        end_time:        `${search.end_date}T${search.end_time}`,
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
