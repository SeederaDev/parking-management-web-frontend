<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Contatti - Palmieri & Treglia" });
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Contatti"
      title="Parliamo."
      description="Siamo qui per aiutarti. Contattaci per qualsiasi informazione o preventivo."
    />
    <section>
      <div class="container">
        <div class="contact-grid">
          <div>
            <div class="sec-title small-title" data-reveal>Dove trovarci</div>
            <div class="contact-info mt-24">
              <div class="contact-item" data-reveal>
                <div class="contact-item-ic">
                  <svg><use href="#ic-pin" /></svg>
                </div>
                <div>
                  <h4>Sede di Formia</h4>
                  <p>Via Andrea Ciardo, 36 - Formia (LT)</p>
                  <p>Via San Pietro - Formia (LT)</p>
                </div>
              </div>
              <div class="contact-item" data-reveal="delay-1">
                <div class="contact-item-ic">
                  <svg><use href="#ic-pin" /></svg>
                </div>
                <div>
                  <h4>Sede di Gaeta</h4>
                  <p>Via Sant'Agostino km. 2.750 - Gaeta (LT)</p>
                </div>
              </div>
              <div class="contact-item" data-reveal="delay-2">
                <div class="contact-item-ic">
                  <svg><use href="#ic-phone" /></svg>
                </div>
                <div>
                  <h4>Telefono</h4>
                  <p><a href="tel:077123652">0771 23652</a></p>
                  <p><a href="tel:3402525600">340 2525600</a></p>
                  <p><a href="tel:3392785810">339 2785810</a></p>
                </div>
              </div>
              <div class="contact-item" data-reveal="delay-3">
                <div class="contact-item-ic">
                  <svg><use href="#ic-mail" /></svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>
                    <a href="mailto:info@palmieritreglia.it"
                      >info@palmieritreglia.it</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div class="hours-block" data-reveal>
              <h5>Orari Ufficio - Formia</h5>
              <div class="hours-row">
                <span class="day">Lunedi - Venerdi</span
                ><span class="time">08:30 - 13:00 / 15:00 - 19:30</span>
              </div>
              <div class="hours-row">
                <span class="day">Sabato</span
                ><span class="time">08:30 - 13:00</span>
              </div>
              <div class="hours-row">
                <span class="day">Domenica</span
                ><span class="time">Chiuso</span>
              </div>
            </div>
            <div class="sos-always" data-reveal="delay-1">
              Soccorso Stradale attivo h24 - 7 giorni su 7
            </div>
          </div>
          <div>
            <div class="sec-title small-title" data-reveal>Scrivici</div>
            <p class="form-intro" data-reveal>
              Compila il modulo per informazioni o preventivi.
            </p>
            <div class="contact-form" data-reveal="delay-1">
              <div class="form-row">
                <input type="text" /><input
                  type="text"
                />
              </div>
              <input type="email" />
              <input type="tel" />
              <select>
                <option value="">Servizio di interesse</option>
                <option>Soccorso Stradale</option>
                <option>Noleggio Auto</option>
                <option>Parcheggio Lunga Sosta</option>
                <option>Vendita Auto</option>
                <option>Car Valet</option>
                <option>Altro</option>
              </select>
              <textarea></textarea>
              <button class="btn btn-red" type="button">Invia Messaggio</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
