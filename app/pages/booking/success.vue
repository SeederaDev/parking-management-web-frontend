<template>
  <div class="page">

    <!-- Verifying -->
    <section v-if="verifying" style="min-height:60vh;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center">
        <svg class="spin" width="48" height="48" fill="none" viewBox="0 0 24 24" style="color:var(--navy);margin:0 auto 24px">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
          <path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
        </svg>
        <p style="color:var(--gray-400);font-size:.95rem">Verifica del pagamento in corso…</p>
      </div>
    </section>

    <!-- Success -->
    <template v-else-if="paid">
      <!-- Hero band -->
      <div class="success-hero">
        <div class="success-check">✓</div>
        <h1>Grazie per la tua prenotazione!</h1>
        <p>Il pagamento è stato confermato. Ti aspettiamo al parcheggio.</p>
      </div>

      <section>
        <div class="container" style="max-width:620px">

          <!-- Booking card -->
          <div v-if="booking" class="success-card">
            <div class="success-card-header">
              <div class="success-card-label">Riepilogo prenotazione</div>
              <div class="success-card-status">Confermata</div>
            </div>
            <div class="success-card-body">
              <div class="success-row">
                <span class="success-key">Parcheggio</span>
                <span class="success-val">{{ booking.location_name }}</span>
              </div>
              <div class="success-row">
                <span class="success-key">Posto</span>
                <span class="success-val">{{ booking.spot_identifier }}</span>
              </div>
              <div class="success-row">
                <span class="success-key">Data ingresso</span>
                <span class="success-val">{{ fmtDate(booking.start_time) }}</span>
              </div>
              <div class="success-row">
                <span class="success-key">Data uscita</span>
                <span class="success-val">{{ fmtDate(booking.end_time) }}</span>
              </div>
              <div class="success-row success-row--total">
                <span class="success-key">Totale pagato</span>
                <span class="success-total">€ {{ booking.price }}</span>
              </div>
            </div>
          </div>

          <!-- Info boxes -->
          <div class="success-info-grid">
            <div class="success-info-box">
              <div class="success-info-icon">🕐</div>
              <div class="success-info-title">Orario di apertura</div>
              <div class="success-info-text">Lun–Sab 06:00–01:00<br>Dom e festivi 06:00–10:00 e 18:00–01:00</div>
            </div>
            <div class="success-info-box">
              <div class="success-info-icon">🔑</div>
              <div class="success-info-title">Consegna chiavi</div>
              <div class="success-info-text">Le chiavi del veicolo devono essere consegnate agli addetti all'arrivo.</div>
            </div>
            <div class="success-info-box">
              <div class="success-info-icon">🚐</div>
              <div class="success-info-title">Navetta gratuita</div>
              <div class="success-info-text">Navetta inclusa per il porto di Formia, Ponza e Ventotene.</div>
            </div>
          </div>

          <!-- Confirmation note -->
          <p class="success-email-note">
            Hai ricevuto un'email di conferma con tutti i dettagli. Controlla anche la cartella spam se non la trovi.
          </p>

          <!-- CTA -->
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <NuxtLink to="/booking" class="btn btn-navy">Le mie prenotazioni</NuxtLink>
            <NuxtLink to="/" class="btn btn-outline-dark">Torna alla home</NuxtLink>
          </div>

        </div>
      </section>
    </template>

    <!-- Webhook still processing -->
    <template v-else-if="pollingTimeout">
      <section style="min-height:60vh;display:flex;align-items:center">
        <div class="container" style="max-width:560px;text-align:center">
          <div style="font-size:3rem;margin-bottom:20px">⏳</div>
          <h1 class="sec-title" style="margin-bottom:12px">Pagamento in elaborazione</h1>
          <p style="color:var(--gray-400);line-height:1.7;margin-bottom:32px">
            Il pagamento è stato ricevuto ma la conferma è ancora in elaborazione. Controlla lo stato nelle tue prenotazioni tra qualche minuto.
          </p>
          <NuxtLink to="/booking" class="btn btn-navy">Vedi le mie prenotazioni</NuxtLink>
        </div>
      </section>
    </template>

    <!-- Error -->
    <template v-else-if="pageError">
      <section style="min-height:60vh;display:flex;align-items:center">
        <div class="container" style="max-width:560px;text-align:center">
          <div style="font-size:3rem;margin-bottom:20px">⚠️</div>
          <h1 class="sec-title" style="margin-bottom:12px">Errore di verifica</h1>
          <p style="color:var(--gray-400);line-height:1.7;margin-bottom:32px">{{ pageError }}</p>
          <NuxtLink to="/booking" class="btn btn-navy">Torna alle prenotazioni</NuxtLink>
        </div>
      </section>
    </template>

  </div>
</template>

<script setup lang="ts">
import type { Booking } from '~/types';

definePageMeta({ layout: 'default' });
useHead({ title: 'Prenotazione confermata — Palmieri & Treglia' });

const route = useRoute();
const api   = useApi();

const sessionId = route.query.session_id as string | undefined;

const verifying      = ref(true);
const paid           = ref(false);
const pollingTimeout = ref(false);
const pageError      = ref<string | null>(null);
const booking        = ref<Booking | null>(null);

function fmtDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

onMounted(async () => {
  // Offline guarantee path — no session_id, booking already confirmed
  if (route.query.offline === '1') {
    paid.value      = true;
    verifying.value = false;
    return;
  }

  if (!sessionId) {
    verifying.value = false;
    pageError.value = 'Nessun ID sessione trovato.';
    return;
  }

  const MAX_ATTEMPTS = 6;
  const DELAY_MS     = 2000;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, DELAY_MS));
    try {
      const data = await api<{ paid: boolean; booking: Booking }>(
        `/payments/verify/?session_id=${sessionId}`
      );
      booking.value = data.booking;
      if (data.paid) {
        paid.value      = true;
        verifying.value = false;
        return;
      }
    } catch {
      pageError.value = 'Impossibile verificare il pagamento. Controlla le tue prenotazioni.';
      verifying.value = false;
      return;
    }
  }

  pollingTimeout.value = true;
  verifying.value      = false;
});
</script>

<style scoped>
/* spinner */
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* hero band */
.success-hero {
  background: linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 100%);
  color: #fff;
  text-align: center;
  padding: 80px 32px 64px;
}
.success-check {
  width: 72px; height: 72px; border-radius: 50%;
  background: #4caf50;
  color: #fff; font-size: 2rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
}
.success-hero h1 {
  font-family: var(--display); font-size: clamp(24px, 4vw, 40px);
  font-weight: 800; margin-bottom: 12px;
}
.success-hero p { font-size: 1rem; opacity: .7; max-width: 480px; margin: 0 auto; line-height: 1.7; }

/* card */
.success-card { border: 1px solid #e8e8e8; border-radius: 16px; overflow: hidden; margin-bottom: 28px; }
.success-card-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; background: var(--off-white); border-bottom: 1px solid #e8e8e8;
}
.success-card-label { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--gray-400); }
.success-card-status { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #4caf50; background: #f0faf0; border: 1px solid #b2dfb2; padding: 4px 12px; border-radius: 100px; }
.success-card-body { padding: 8px 24px 20px; }
.success-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f4f4f4; gap: 16px; }
.success-row:last-child { border-bottom: none; }
.success-row--total { margin-top: 4px; }
.success-key { font-size: .8rem; color: var(--gray-400); font-weight: 500; }
.success-val { font-size: .85rem; color: var(--gray-800); font-weight: 600; text-align: right; }
.success-total { font-size: 1.1rem; color: var(--navy); font-weight: 800; }

/* info grid */
.success-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
.success-info-box { background: var(--off-white); border-radius: 12px; padding: 20px 18px; }
.success-info-icon { font-size: 1.4rem; margin-bottom: 10px; }
.success-info-title { font-size: .78rem; font-weight: 700; color: var(--navy-deep); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
.success-info-text { font-size: .75rem; color: var(--gray-400); line-height: 1.6; }

.success-email-note { font-size: .82rem; color: var(--gray-400); background: var(--off-white); border-radius: 10px; padding: 14px 18px; margin-bottom: 28px; line-height: 1.6; }

@media (max-width: 600px) {
  .success-info-grid { grid-template-columns: 1fr; }
  .success-hero { padding: 60px 20px 48px; }
}
</style>
