<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Vendita Auto - Palmieri & Treglia" });
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Vendita Auto"
      title="Auto Nuove e Usate"
      description="Le migliori marche con consulenza personalizzata a Formia. Vieni a scoprire la disponibilita."
    />
    <section>
      <div class="container">
        <div class="sec-label" data-reveal>Il nostro catalogo</div>
        <div class="sec-title" data-reveal>Trova l'auto giusta per te.</div>
        <div class="sec-desc" data-reveal="delay-1">
          Auto nuove e usate con garanzia e possibilita di finanziamento
          personalizzato.
        </div>
        <div class="auto-grid">
          <div
            v-for="(brand, index) in brands"
            :key="brand"
            class="auto-card"
            :data-reveal="index ? revealDelay(index) : ''"
          >
            <div class="auto-card-img">
              <div class="img-placeholder">
                <span>{{ brand }} lineup photo</span>
              </div>
              <div class="auto-brand-tag">{{ brand }}</div>
            </div>
            <div class="auto-card-body">
              <h4>{{ brand }}</h4>
              <p>
                {{
                  brand === "Range Rover"
                    ? "Lusso e prestazioni senza compromessi"
                    : "Gamma di modelli nuovi e usati selezionati"
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="center-cta" data-reveal>
          <p>Vuoi conoscere le auto disponibili o richiedere un preventivo?</p>
          <NuxtLink to="/contatti" class="btn btn-navy"
            >Contattaci per la disponibilita</NuxtLink
          >
        </div>
      </div>
    </section>
  </div>
</template>
