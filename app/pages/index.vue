<template>
  <div class="page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-scene">
          <span>Formia</span><strong>Automotive services</strong>
        </div>
      </div>
      <div class="hero-overlay" />
      <div class="container">
        <div class="hero-content" data-reveal>
          <div class="hero-tag">Dal 1966 - Formia &amp; Gaeta</div>
          <h1>
            Soccorso stradale, noleggio e vendita auto
            <span class="accent">dal 1966</span>
          </h1>
          <p>
            Un unico punto di riferimento per soccorso stradale h24, noleggio
            auto, parcheggio lunga sosta per le Isole Pontine e vendita auto nel
            sud pontino.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/contatti" class="btn btn-red"
              >Richiedi Preventivo</NuxtLink
            >
            <a href="tel:077123652" class="btn btn-ghost"
              ><svg width="16" height="16"><use href="#ic-phone" /></svg> 0771
              23652</a
            >
            <a href="tel:3402525600" class="btn btn-ghost"
              ><svg width="16" height="16"><use href="#ic-phone" /></svg> 340
              2525600</a
            >
          </div>
          <div class="hero-stats" data-reveal="delay-2">
            <div class="hero-stat">
              <div class="val">60+</div>
              <div class="lbl">Anni di attivita</div>
            </div>
            <div class="hero-stat">
              <div class="val">h24</div>
              <div class="lbl">Soccorso stradale</div>
            </div>
            <div class="hero-stat">
              <div class="val">2</div>
              <div class="lbl">Sedi operative</div>
            </div>
            <div class="hero-stat">
              <div class="val">ISO</div>
              <div class="lbl">Certificati 9001</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee">
        <span v-for="(item, index) in marqueeLoop" :key="`${item}-${index}`">{{
          item
        }}</span>
      </div>
    </div>

    <!-- Booking widget -->
    <section style="background: var(--off-white)">
      <div class="container">
        <div class="sec-label" data-reveal>ParkinGO Cruise</div>
        <div class="sec-title" data-reveal>Prenota il tuo posto.</div>
        <div class="sec-desc" data-reveal="delay-1">
          Parcheggio custodito con navetta gratuita per le Isole Pontine di
          Ponza e Ventotene.
        </div>
        <div class="booking-widget" data-reveal="delay-2">
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
              :disabled="!search.location_id || searching"
              @click="doSearch('home-risultati')"
            >
              <svg v-if="!searching" width="16" height="16"><use href="#ic-parking" /></svg>
              {{ searching ? "Ricerca in corso…" : "Controlla disponibilità" }}
            </button>
          </div>
        </div>

        <!-- Inline results -->
        <div id="home-risultati" class="mt-48">
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

    <!-- Services -->
    <section class="services-section">
      <div class="container">
        <div class="sec-label" data-reveal>I nostri servizi</div>
        <div class="sec-title" data-reveal>
          Tutto per la tua auto,<br />in un solo posto.
        </div>
        <div class="sec-desc" data-reveal="delay-1">
          Da oltre mezzo secolo al servizio di automobilisti, viaggiatori e
          aziende nell'area di Formia, Gaeta e Minturno.
        </div>
        <div class="services-grid">
          <SiteServiceCard
            v-for="(service, index) in services"
            :key="service.title"
            :to="service.path"
            :icon="service.icon"
            :icon-class="service.iconClass"
            :title="service.title"
            :text="service.text"
            :delay="index ? revealDelay(index) : ''"
          />
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-visual" data-reveal>
            <div class="about-img-main brand-panel">
              <img src="/logo.avif" alt="Palmieri &amp; Treglia" />
            </div>
            <div class="about-float">
              <div class="num">60+</div>
              <div class="lbl">Anni di esperienza</div>
            </div>
          </div>
          <div data-reveal="delay-2">
            <div class="sec-label">Chi Siamo</div>
            <div class="sec-title">
              Un punto di riferimento nel sud pontino.
            </div>
            <div class="about-text">
              <p>
                Con oltre sessant'anni nel settore automobilistico, Palmieri
                &amp; Treglia rappresenta la scelta di fiducia per chi cerca
                assistenza completa a Formia e dintorni.
              </p>
              <p>
                Il nostro impegno costante si traduce in servizi efficienti e
                orientati al cliente: cortesia, trasparenza e competenza sono i
                valori su cui abbiamo costruito la nostra reputazione.
              </p>
            </div>
            <div class="about-badges">
              <div class="about-badge">
                <svg><use href="#ic-award" /></svg> ISO 9001
              </div>
              <div class="about-badge">
                <svg><use href="#ic-clock" /></svg> Attivi h24
              </div>
              <div class="about-badge">
                <svg><use href="#ic-pin" /></svg> 2 Sedi
              </div>
            </div>
            <NuxtLink to="/chi-siamo" class="btn btn-outline-dark mt-28"
              >Scopri la nostra storia
              <svg width="14" height="14"><use href="#ic-arrow" /></svg
            ></NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Parking promo -->
    <section class="parking-section">
      <div class="container">
        <div class="parking-grid">
          <div data-reveal>
            <div class="parking-logo-text">ParkinGO Cruise</div>
            <h2>Il tuo parcheggio per le Isole Pontine</h2>
            <p>
              Parcheggia in sicurezza e raggiungi il porto con la navetta
              gratuita per Ponza e Ventotene.
            </p>
            <div class="park-feats">
              <div
                v-for="feature in parkingFeatures.slice(0, 3)"
                :key="feature.title"
                class="park-feat"
              >
                <div class="park-feat-ic">
                  <svg><use :href="`#${feature.icon}`" /></svg>
                </div>
                <div>
                  <h5>{{ feature.title }}</h5>
                  <p>{{ feature.text }}</p>
                </div>
              </div>
            </div>
            <NuxtLink to="/parcheggio" class="btn btn-red mt-32"
              >Scopri il Parcheggio</NuxtLink
            >
          </div>
          <div class="parking-visual" data-reveal="delay-2">
            <div class="parking-card-visual">
              <span>P</span><strong>Navetta Porto</strong
              ><small>Videosorveglianza h24</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <div class="cta-band">
      <h3 data-reveal>Hai bisogno di assistenza?</h3>
      <p data-reveal="delay-1">
        Soccorso stradale attivo h24 - chiamaci adesso.
      </p>
      <div data-reveal="delay-2" class="cta-actions">
        <a href="tel:077123652" class="btn btn-ghost"
          ><svg width="16" height="16"><use href="#ic-phone" /></svg> 0771
          23652</a
        >
        <a href="tel:3402525600" class="btn btn-ghost"
          ><svg width="16" height="16"><use href="#ic-phone" /></svg> 340
          2525600</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Palmieri & Treglia - Dal 1966" });

const authStore = useAuthStore();
if (import.meta.client && authStore.isAuthenticated) {
  navigateTo(authStore.isAdmin ? "/dashboard" : "/parcheggio");
}

const marqueeLoop = [...marqueeItems, ...marqueeItems];

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
