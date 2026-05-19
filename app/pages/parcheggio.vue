<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Parcheggio Lunga Sosta - Palmieri & Treglia" });

const iconClassFor = (index: string | number) =>
  Number(index) % 3 === 0 ? "ic-gold" : Number(index) % 3 === 1 ? "ic-red" : "ic-blue";

const {
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
} = useBookingSearch();
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
        <!-- About -->
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
            <a href="#prenota" class="btn btn-navy mt-24">Prenota il tuo posto</a>
          </div>
          <div class="parking-highlight" data-reveal="delay-2">
            <div class="parking-logo-text dark">ParkinGO Cruise</div>
          </div>
        </div>

        <!-- Features -->
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
          <div class="sec-desc">Scegli le date del tuo soggiorno e seleziona il tipo di veicolo.</div>

          <div class="booking-widget mt-32">
            <div class="booking-loc">
              <svg width="18" height="18"><use href="#ic-pin" /></svg>
              <select v-model="search.location_id">
                <option value="">Seleziona parcheggio…</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div class="booking-dates">
              <div class="booking-date-col">
                <div class="booking-date-label">Ingresso</div>
                <input v-model="search.start_date" type="date" aria-label="Data ingresso" />
                <input v-model="search.start_time" type="time" aria-label="Ora ingresso" />
              </div>
              <div class="booking-date-col">
                <div class="booking-date-label">Uscita</div>
                <input v-model="search.end_date" type="date" aria-label="Data uscita" />
                <input v-model="search.end_time" type="time" aria-label="Ora uscita" />
              </div>
            </div>
            <div class="booking-vtypes">
              <label
                v-for="vt in bookingVehicleTypes"
                :key="vt.value"
                class="booking-vt"
                :class="{ active: search.vehicle_type === vt.value }"
              >
                <input type="radio" v-model="search.vehicle_type" :value="vt.value" class="sr-only" />
                <span class="booking-vt-icon">{{ vt.icon }}</span>
                <span class="booking-vt-label">{{ vt.label }}</span>
              </label>
            </div>
            <div class="booking-footer">
              <button
                class="btn btn-navy"
                style="width:100%;justify-content:center"
                :disabled="!canSearch || searching"
                @click="doSearch('risultati')"
              >
                <svg v-if="!searching" width="16" height="16"><use href="#ic-parking" /></svg>
                {{ searching ? "Ricerca in corso…" : "Controlla disponibilità" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div id="risultati" class="mt-48">
          <template v-if="searched && groupedSpots.length">
            <div class="sec-label">Disponibilità</div>
            <div class="sec-title" style="margin-bottom:32px">Scegli il tuo posto.</div>
          </template>
          <BookingAvailabilityResults
            :searched="searched"
            :search-error="searchError"
            :selected-type="selectedType"
            :grouped-spots="groupedSpots"
            @select="selectGroup"
          />
        </div>
      </div>
    </section>
  </div>
</template>
