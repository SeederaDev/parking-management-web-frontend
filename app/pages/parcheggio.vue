<script setup lang="ts">
definePageMeta({ layout: "site" });
const iconClassFor = (index: string | number) =>
  Number(index) % 3 === 0
    ? "ic-gold"
    : Number(index) % 3 === 1
    ? "ic-red"
    : "ic-blue";
useHead({ title: "Parcheggio Lunga Sosta - Palmieri & Treglia" });
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
            <NuxtLink to="/contatti" class="btn btn-navy mt-24"
              >Prenota il tuo posto</NuxtLink
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
      </div>
    </section>
  </div>
</template>
