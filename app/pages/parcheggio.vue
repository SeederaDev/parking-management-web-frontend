<script setup lang="ts">
definePageMeta({ layout: "site" });
const iconClassFor = (index: string | number) =>
  Number(index) % 3 === 0
    ? "ic-gold"
    : Number(index) % 3 === 1
    ? "ic-red"
    : "ic-blue";
useHead({ title: "Parcheggio Lunga Sosta - Palmieri & Treglia" });

const parkingStore = useParkingStore();
const { fetchLocations } = useParking();
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
  { value: "standard", label: "Auto", icon: "🚗" },
  { value: "disabled", label: "Accessibile", icon: "♿" },
  { value: "ev", label: "Elettrico", icon: "⚡" },
  { value: "vip", label: "VIP", icon: "⭐" },
];

function doSearch() {
  if (!search.location_id) return;
  const query: Record<string, string> = { location_id: search.location_id };
  if (search.start_date && search.start_time)
    query.start_time = `${search.start_date}T${search.start_time}`;
  if (search.end_date && search.end_time)
    query.end_time = `${search.end_date}T${search.end_time}`;
  router.push({ path: "/parking", query });
}

onMounted(() => {
  fetchLocations();
});
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="ParkinGO Cruise"
      title="Parcheggio Lunga Sosta"
      description="Parcheggio custodito a Formia con navetta gratuita per il porto, Isole di Ponza e Ventotene."
    />
    <section>
      <div class="container">
        <div class="about-grid">
          <div data-reveal>
            <div class="sec-label">Il servizio</div>
            <div class="sec-title">Parcheggia e parti tranquillo.</div>
            <div class="about-text">
              <p>
                ParkinGO si trova a Formia (LT) in Via San Pietro presso la
                Palmieri &amp; Treglia srl. Lascia comodamente la tua auto e usa
                il servizio navetta per raggiungere l'imbarco alle isole pontine
                di Ponza e Ventotene.
              </p>
              <p>
                Supportiamo anche privati, aziende e professionisti che vogliono
                lasciare il proprio mezzo per raggiungere la stazione
                ferroviaria. Contattaci per servizi personalizzati.
              </p>
            </div>
            <a href="#prenota" class="btn btn-navy mt-24"
              >Prenota il tuo posto</a
            >
          </div>
          <div class="parking-highlight" data-reveal="delay-2">
            <div class="parking-logo-text dark">ParkinGO Cruise</div>
          </div>
        </div>
        <div class="services-grid mt-72">
          <SiteServiceCard
            v-for="(feature, index) in parkingFeatures"
            :key="feature.title"
            :icon="feature.icon"
            :icon-class="iconClassFor(index)"
            :title="feature.title"
            :text="feature.text"
            :delay="index ? revealDelay(index) : ''"
          />
        </div>

        <!-- Booking widget -->
        <div id="prenota" class="mt-80" data-reveal>
          <div class="sec-label">Prenota ora</div>
          <div class="sec-title">Verifica disponibilità.</div>
          <div class="sec-desc">
            Scegli le date del tuo soggiorno e seleziona il tipo di veicolo.
          </div>
          <div class="booking-widget mt-32">
            <div class="booking-loc">
              <svg width="18" height="18"><use href="#ic-pin" /></svg>
              <select v-model="search.location_id">
                <option value="">Seleziona parcheggio…</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
            </div>
            <div class="booking-dates">
              <div class="booking-date-col">
                <div class="booking-date-label">Ingresso</div>
                <input
                  v-model="search.start_date"
                  type="date"
                  aria-label="Data ingresso"
                />
                <input
                  v-model="search.start_time"
                  type="time"
                  aria-label="Ora ingresso"
                />
              </div>
              <div class="booking-date-col">
                <div class="booking-date-label">Uscita</div>
                <input
                  v-model="search.end_date"
                  type="date"
                  aria-label="Data uscita"
                />
                <input
                  v-model="search.end_time"
                  type="time"
                  aria-label="Ora uscita"
                />
              </div>
            </div>
            <div class="booking-vtypes">
              <label
                v-for="vt in vehicleTypes"
                :key="vt.value"
                class="booking-vt"
                :class="{ active: search.vehicle_type === vt.value }"
              >
                <input
                  type="radio"
                  v-model="search.vehicle_type"
                  :value="vt.value"
                  class="sr-only"
                />
                <span class="booking-vt-icon">{{ vt.icon }}</span>
                <span class="booking-vt-label">{{ vt.label }}</span>
              </label>
            </div>
            <div class="booking-footer">
              <button
                class="btn btn-navy"
                style="width: 100%; justify-content: center"
                :disabled="!search.location_id"
                @click="doSearch"
              >
                <svg width="16" height="16"><use href="#ic-parking" /></svg>
                Controlla disponibilità
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
