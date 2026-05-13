<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Soccorso Stradale - Palmieri & Treglia" });
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Soccorso Stradale"
      title="Assistenza h24,<br>7 giorni su 7."
      description="Intervento rapido e professionale su tutto il territorio: Formia, Gaeta, Minturno e oltre."
    />
    <section>
      <div class="container">
        <div class="sos-banner" data-reveal>
          <h3>Hai bisogno di soccorso?</h3>
          <p>Chiamaci subito, siamo sempre operativi.</p>
          <a href="tel:077123652" class="sos-phone">0771 23652</a><br />
          <a href="tel:3402525600" class="sos-secondary">oppure 340 2525600</a>
        </div>
        <div class="sec-label" data-reveal>Cosa facciamo</div>
        <div class="sec-title" data-reveal>Interveniamo sempre, ovunque.</div>
        <div class="sos-grid">
          <div
            v-for="(card, index) in sosCards"
            :key="card.title"
            class="sos-card"
            :data-reveal="index ? revealDelay(index) : ''"
          >
            <div class="sos-card-ic">
              <svg><use :href="`#${card.icon}`" /></svg>
            </div>
            <h4>{{ card.title }}</h4>
            <p>{{ card.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
