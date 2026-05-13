<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Noleggio Auto - Palmieri & Treglia" });
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Rent Car"
      title="Noleggio Auto a Formia"
      description="Ampia flotta per ogni esigenza, dalle city car ai SUV, per privati e aziende."
    />
    <section>
      <div class="container">
        <div class="sec-label" data-reveal>La nostra flotta</div>
        <div class="sec-title" data-reveal>Scegli l'auto giusta per te.</div>
        <div class="sec-desc" data-reveal="delay-1">
          Tariffe giornaliere, settimanali e mensili. Contattaci per un
          preventivo personalizzato.
        </div>
        <div class="rent-grid">
          <div
            v-for="(car, index) in fleet"
            :key="car.title"
            class="rent-card"
            :data-reveal="index ? `delay-${index}` : ''"
          >
            <div class="rent-card-img">
              <div class="img-placeholder">
                <span>{{ car.title }} photo</span>
              </div>
            </div>
            <div class="rent-card-body">
              <div class="cat">{{ car.category }}</div>
              <h4>{{ car.title }}</h4>
              <p>{{ car.text }}</p>
            </div>
          </div>
        </div>
        <div class="rent-form-section" data-reveal>
          <h3>Richiedi un preventivo</h3>
          <p>
            Compila il modulo o chiamaci per ricevere il tuo preventivo
            personalizzato.
          </p>
          <div class="contact-form max-640">
            <div class="form-row">
              <input type="text" placeholder="Nome e Cognome" /><input
                type="email"
                placeholder="Email"
              />
            </div>
            <div class="form-row">
              <input type="tel" placeholder="Telefono" /><select>
                <option value="">Tipo veicolo</option>
                <option>City Car</option>
                <option>Berlina</option>
                <option>SUV</option>
                <option>Altro</option>
              </select>
            </div>
            <div class="form-row">
              <input type="date" aria-label="Data ritiro" /><input
                type="date"
                aria-label="Data riconsegna"
              />
            </div>
            <textarea placeholder="Note aggiuntive..."></textarea>
            <button class="btn btn-red" type="button">Invia Richiesta</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
