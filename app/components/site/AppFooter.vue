<template>
  <footer>
    <div class="footer-top">
      <div class="footer-brand">
        <NuxtLink to="/" class="nav-logo footer-logo">
          <img
            src="/logo.avif"
            alt="Palmieri &amp; Treglia"
            class="brand-logo footer-brand-logo"
          />
        </NuxtLink>
        <p>
          Soccorso Stradale, Noleggio Auto, Parcheggio Lunga Sosta e Vendita
          Auto dal 1966. Formia e Gaeta.
        </p>
      </div>
      <div>
        <h6>Servizi</h6>
        <ul>
          <li><NuxtLink to="/soccorso">Soccorso Stradale</NuxtLink></li>
          <li><NuxtLink to="/noleggio">Noleggio Auto</NuxtLink></li>
          <li><NuxtLink to="/parcheggio">Parcheggio</NuxtLink></li>
          <li><NuxtLink to="/vendita">Vendita Auto</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h6>Contatti</h6>
        <ul>
          <li><a href="tel:077123652">0771 23652</a></li>
          <li><a href="tel:3402525600">340 2525600</a></li>
          <li>
            <a href="mailto:info@palmieritreglia.it">info@palmieritreglia.it</a>
          </li>
        </ul>
      </div>
      <div>
        <h6>Sedi</h6>
        <ul>
          <li>
            <NuxtLink to="/contatti">Via A. Ciardo, 36 - Formia (LT)</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contatti">Via San Pietro - Formia (LT)</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contatti"
              >Via Sant'Agostino km 2.750 - Gaeta (LT)</NuxtLink
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span
        >© 2026 Palmieri &amp; Treglia s.r.l. - P.IVA 01361320599 - Certificata
        ISO 9001</span
      >
      <span>Tutti i diritti riservati</span>
    </div>
  </footer>
</template>
