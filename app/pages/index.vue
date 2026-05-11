<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-indigo-600 text-white">
      <div
        class="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h1 class="text-4xl font-bold mb-8">Trova il tuo parcheggio</h1>

          <!-- Search card -->
          <div
            class="bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <!-- Location selector -->
            <div
              class="flex items-center gap-3 px-5 py-4 border-b border-gray-100"
            >
              <span class="text-indigo-600 text-lg shrink-0">📍</span>
              <select
                v-model="search.location_id"
                class="flex-1 outline-none text-sm bg-transparent text-gray-700 font-medium"
              >
                <option value="">Inserisci destinazione</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
            </div>

            <!-- Date/time grid -->
            <div
              class="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100"
            >
              <div class="px-5 py-4">
                <div
                  class="text-xs font-bold text-center text-gray-400 uppercase tracking-widest mb-3"
                >
                  Ingresso
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-gray-400 text-sm shrink-0">📅</span>
                  <input
                    v-model="search.start_date"
                    type="date"
                    class="flex-1 text-sm outline-none text-gray-600 min-w-0"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400 text-sm shrink-0">🕐</span>
                  <input
                    v-model="search.start_time"
                    type="time"
                    class="flex-1 text-sm outline-none text-gray-600 min-w-0"
                  />
                </div>
              </div>
              <div class="px-5 py-4">
                <div
                  class="text-xs font-bold text-center text-gray-400 uppercase tracking-widest mb-3"
                >
                  Uscita
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-gray-400 text-sm shrink-0">📅</span>
                  <input
                    v-model="search.end_date"
                    type="date"
                    class="flex-1 text-sm outline-none text-gray-600 min-w-0"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-400 text-sm shrink-0">🕐</span>
                  <input
                    v-model="search.end_time"
                    type="time"
                    class="flex-1 text-sm outline-none text-gray-600 min-w-0"
                  />
                </div>
              </div>
            </div>

            <!-- Vehicle types -->
            <div class="flex justify-around px-5 py-4 border-b border-gray-100">
              <label
                v-for="vt in vehicleTypes"
                :key="vt.value"
                class="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="radio"
                  v-model="search.vehicle_type"
                  :value="vt.value"
                  class="sr-only"
                />
                <span
                  class="text-2xl transition-opacity"
                  :class="
                    search.vehicle_type === vt.value
                      ? 'opacity-100'
                      : 'opacity-30'
                  "
                  >{{ vt.icon }}</span
                >
              </label>
            </div>

            <!-- CTA -->
            <div class="px-5 py-4">
              <button
                :disabled="!search.location_id"
                class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors uppercase tracking-widest text-sm"
                @click="doSearch"
              >
                Cerca
              </button>
            </div>
          </div>
        </div>

        <!-- Illustration -->
        <div class="hidden lg:flex items-center justify-center">
          <div class="relative">
            <div
              class="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center"
            >
              <span class="text-[110px]">🅿</span>
            </div>
            <div
              class="absolute -top-4 -right-6 bg-white text-indigo-600 rounded-2xl shadow-lg px-4 py-2 text-sm font-bold"
            >
              📍 Trova &amp; Prenota
            </div>
            <div
              class="absolute -bottom-4 -left-6 bg-indigo-500 text-white rounded-2xl shadow-lg px-4 py-2 text-sm font-bold"
            >
              ✅ Paga Online
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Parking locations grid -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          class="text-indigo-600 text-xs font-bold uppercase tracking-widest text-center mb-2"
        >
          Dove Siamo
        </p>
        <h2
          class="text-3xl font-bold text-center text-gray-900 uppercase mb-4 tracking-tight"
        >
          I Nostri Parcheggi
        </h2>
        <p
          class="text-gray-400 text-center text-sm max-w-xl mx-auto mb-14 leading-relaxed"
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-if="loadingLocations"
            class="col-span-full text-center py-12 text-gray-400"
          >
            Caricamento…
          </div>
          <NuxtLink
            v-for="loc in locations"
            :key="loc.id"
            :to="`/parking?location_id=${loc.id}`"
            class="group border border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div
              class="text-5xl mb-4 inline-block group-hover:scale-110 transition-transform"
            >
              📍
            </div>
            <h3
              class="font-bold text-gray-900 uppercase text-base mb-1 tracking-wide"
            >
              {{ loc.name }}
            </h3>
            <p class="text-gray-400 text-xs uppercase tracking-wide">
              {{ loc.address }}
            </p>
          </NuxtLink>
          <div
            v-if="!loadingLocations && locations.length === 0"
            class="col-span-full text-center py-12 text-gray-400"
          >
            Nessun parcheggio disponibile.
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section
      class="py-20 border-t-2 border-b-2 border-dashed border-gray-200 bg-gray-50"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          class="text-indigo-600 text-xs font-bold uppercase tracking-widest text-center mb-2"
        >
          Lorem Ipsum
        </p>
        <h2
          class="text-3xl font-bold text-center text-gray-900 uppercase mb-4 tracking-tight"
        >
          Le Funzionalità di cui hai bisogno
        </h2>
        <p
          class="text-gray-400 text-center text-sm max-w-xl mx-auto mb-16 leading-relaxed"
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div v-for="feat in features" :key="feat.title" class="text-center">
            <div class="text-indigo-600 text-4xl mb-4">{{ feat.icon }}</div>
            <h3
              class="font-bold text-gray-800 uppercase text-xs mb-2 tracking-widest"
            >
              {{ feat.title }}
            </h3>
            <p class="text-gray-400 text-xs leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
        <div class="text-center">
          <NuxtLink
            to="/parking"
            class="inline-block bg-indigo-600 text-white font-bold px-10 py-3 rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest text-sm"
          >
            Contattaci
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          class="text-indigo-600 text-xs font-bold uppercase tracking-widest text-center mb-2"
        >
          Lorem Ipsum
        </p>
        <h2
          class="text-3xl font-bold text-center text-gray-900 uppercase mb-4 tracking-tight"
        >
          Dicono di Noi
        </h2>
        <p
          class="text-gray-400 text-center text-sm max-w-xl mx-auto mb-16 leading-relaxed"
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            v-for="t in testimonials"
            :key="t.name"
            class="border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <p class="text-gray-500 text-sm leading-relaxed mb-6">
              {{ t.text }}
            </p>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0"
              >
                {{ t.initials }}
              </div>
              <div class="font-semibold text-gray-800 text-sm">
                {{ t.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

if (import.meta.client && authStore.isAuthenticated) {
  navigateTo(authStore.isAdmin ? "/dashboard" : "/parking");
}

const parkingStore = useParkingStore();
const { fetchLocations, loading: loadingLocations } = useParking();
const router = useRouter();

const locations = computed(() => parkingStore.locations);

const search = reactive({
  location_id: "",
  start_date: "",
  start_time: "",
  end_date: "",
  end_time: "",
  vehicle_type: "standard",
});

const vehicleTypes = [
  { value: "standard", icon: "🚗" },
  { value: "disabled", icon: "🛵" },
  { value: "ev", icon: "🚙" },
  { value: "vip", icon: "🚐" },
];

const features = [
  {
    icon: "📹",
    title: "Sorveglianza H24",
    desc: "Amet minim mollit non deserunt ullamco.",
  },
  {
    icon: "💳",
    title: "Diverse Tariffe",
    desc: "Amet minim mollit non deserunt ullamco.",
  },
  {
    icon: "🕐",
    title: "Orari Flessibili",
    desc: "Amet minim mollit non deserunt ullamco.",
  },
  {
    icon: "📱",
    title: "Paga Come Vuoi",
    desc: "Amet minim mollit non deserunt ullamco.",
  },
];

const testimonials = [
  {
    name: "Mario Rossi",
    initials: "MR",
    text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
  {
    name: "Laura Bianchi",
    initials: "LB",
    text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
];

function doSearch() {
  if (!search.location_id) return;
  const query: Record<string, string> = { location_id: search.location_id };
  if (search.start_date && search.start_time) {
    query.start_time = `${search.start_date}T${search.start_time}`;
  }
  if (search.end_date && search.end_time) {
    query.end_time = `${search.end_date}T${search.end_time}`;
  }
  router.push({ path: "/parking", query });
}

onMounted(() => {
  fetchLocations();
});
</script>
