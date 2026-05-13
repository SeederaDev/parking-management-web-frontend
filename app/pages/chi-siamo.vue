<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Chi Siamo - Palmieri & Treglia" });
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Chi Siamo"
      title="Palmieri & Treglia"
      description="Con oltre sessant'anni di esperienza, siamo il punto di riferimento per l'automobilista nel sud pontino."
    />
    <section>
      <div class="container">
        <div class="about-grid">
          <div data-reveal>
            <div class="sec-label">La nostra storia</div>
            <div class="sec-title">
              Dal 1966, al servizio dell'automobilista.
            </div>
            <div class="about-text">
              <p>
                Quando si parla di servizi per l'automobilista a Formia,
                Palmieri e Treglia rappresenta la scelta di fiducia. Con oltre
                cinquant'anni nel settore, offriamo un servizio completo: dal
                soccorso stradale alla vendita auto, dal noleggio al parcheggio
                lunga sosta.
              </p>
              <p>
                Il nostro impegno costante per tutelare i diritti
                dell'automobilista si traduce in un servizio efficiente e
                orientato al cliente. Ogni cliente puo contare su cortesia,
                trasparenza e competenza.
              </p>
              <p>
                Operiamo da due sedi, Formia e Gaeta, servendo privati, aziende
                e liberi professionisti con soluzioni personalizzate.
              </p>
            </div>
            <div class="about-badges">
              <div class="about-badge">
                <svg><use href="#ic-award" /></svg> Certificazione ISO 9001
              </div>
              <div class="about-badge">
                <svg><use href="#ic-bolt" /></svg> Ricarica Elettrica
              </div>
            </div>
          </div>
          <div class="about-visual" data-reveal="delay-2">
            <div class="about-img-main brand-panel">
              <img src="/logo.avif" alt="Palmieri &amp; Treglia" />
            </div>
            <div class="about-float">
              <div class="num">1966</div>
              <div class="lbl">Anno di fondazione</div>
            </div>
          </div>
        </div>
        <div class="services-grid mt-80">
          <SiteServiceCard
            icon="ic-award"
            icon-class="ic-red"
            title="Qualita Certificata"
            text="Certificazione ISO 9001 in tutti i processi e servizi, garanzia di affidabilita."
          />
          <SiteServiceCard
            icon="ic-bolt"
            icon-class="ic-blue"
            title="Mobilita Elettrica"
            text="Stazione di ricarica per auto e moto, la nostra scelta verso una mobilita sostenibile."
            delay="delay-1"
          />
          <SiteServiceCard
            icon="ic-check"
            icon-class="ic-gold"
            title="Servizio Completo"
            text="Supporto a privati, aziende e liberi professionisti con servizi personalizzati."
            delay="delay-2"
          />
        </div>
      </div>
    </section>
  </div>
</template>
