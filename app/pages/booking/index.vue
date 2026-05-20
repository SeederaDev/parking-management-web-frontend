<template>
  <div>

    <!-- ── Booking form (coming from slot selection) ──────────────── -->
    <template v-if="spotId">

      <!-- Stepper -->
      <div class="bk-stepper">
        <div class="container">
          <div class="bk-stepper-inner">
            <NuxtLink to="/parcheggio" class="bk-step bk-step--done">
              <span class="bk-step__num">1</span>
              <span class="bk-step__label">Ricerca</span>
            </NuxtLink>
            <div class="bk-step-line bk-step-line--done" />
            <NuxtLink to="/parcheggio" class="bk-step bk-step--done">
              <span class="bk-step__num">2</span>
              <span class="bk-step__label">Disponibilità</span>
            </NuxtLink>
            <div class="bk-step-line" />
            <div class="bk-step bk-step--active">
              <span class="bk-step__num">3</span>
              <span class="bk-step__label">Prenotazione</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form content -->
      <section>
        <div class="container">
          <div class="booking-form-wrap">

            <!-- Location heading -->
            <h2 class="booking-form-title">{{ locationName }}</h2>

            <!-- Personal info fields -->
            <div class="bform-grid">
              <input v-model="form.first_name"      type="text"  class="bform-input" />
              <input v-model="form.last_name"        type="text"  class="bform-input" />
              <input v-model="form.telefono"          type="tel"   class="bform-input" />
              <input v-model="form.email"             type="email" class="bform-input" />
              <input v-model="form.modello_veicolo"   type="text"  class="bform-input" />
              <input v-model="form.targa"             type="text"  class="bform-input" />
            </div>
            <textarea v-model="form.messaggio" rows="3" class="bform-input bform-textarea" />
            <label class="bform-check">
              <input v-model="form.privacy" type="checkbox" />
              <span>Acconsento al trattamento dei dati personali ai sensi della <a href="/privacy" style="color:var(--navy);text-decoration:underline">Privacy Policy</a></span>
            </label>

            <!-- Riepilogo -->
            <div class="bform-summary">
              <h3 class="bform-summary-title">Riepilogo prenotazione</h3>
              <div class="bform-summary-row">
                <div class="bform-sum-col bform-sum-spot">
                  <svg viewBox="0 0 24 24" width="52" height="36" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--navy)">
                    <path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                    <circle stroke="currentColor" cx="7" cy="17" r="2"/>
                    <circle stroke="currentColor" cx="17" cy="17" r="2"/>
                    <path stroke="currentColor" d="M14 17H10"/>
                  </svg>
                  <div class="bform-sum-spot-label">{{ spotLabel }}</div>
                </div>
                <div class="bform-sum-col">
                  <div class="bform-sum-header">Data Ingresso</div>
                  <div class="bform-sum-val">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {{ fmtDate(startTime) }}
                  </div>
                </div>
                <div class="bform-sum-col">
                  <div class="bform-sum-header">Data Uscita</div>
                  <div class="bform-sum-val">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {{ fmtDate(endTime.slice(0,10) + 'T00:00:00') }}
                  </div>
                </div>
                <div class="bform-sum-col">
                  <div class="bform-sum-header">Paga Online</div>
                  <div class="bform-pay-pill">€ {{ estimatedPrice }} ›</div>
                </div>
              </div>
            </div>

            <!-- Info rows -->
            <div class="bform-info-row">
              <div class="bform-info-label">Orario di Apertura</div>
              <p class="bform-info-text">Dal Lunedì al Sabato dalle 06:00 all'1:00. Domenica e festivi dalle 06:00 alle 10:00 e dalle 18:00 all'1:00.</p>
              <label class="bform-check">
                <input v-model="form.orario_preso_nota" type="checkbox" />
                <span>Ho preso nota dell'orario ridotto del parcheggio.</span>
              </label>
            </div>
            <div class="bform-info-row">
              <div class="bform-info-label">Altre Informazioni</div>
              <p class="bform-info-text">Le chiavi del veicolo devono essere consegnate agli addetti.</p>
              <label class="bform-check">
                <input v-model="form.chiavi_preso_nota" type="checkbox" />
                <span>Ho preso nota della consegna delle chiavi.</span>
              </label>
            </div>
            <div class="bform-info-row">
              <div class="bform-info-label">Altre Informazioni</div>
              <label class="bform-check">
                <input v-model="form.fattura" type="checkbox" />
                <span>Richiedi fattura</span>
              </label>
            </div>

            <div v-if="bookingError" class="bform-error">{{ bookingError }}</div>

            <button :disabled="bookingLoading || !form.privacy" class="bform-confirm" @click="confirmBooking">
              {{ bookingLoading ? 'Creazione prenotazione…' : 'Conferma' }}
            </button>
          </div>
        </div>
      </section>
    </template>

    <!-- ── My bookings (no spot selected) ────────────────────────── -->
    <template v-else>
      <section>
        <div class="container" style="max-width:700px">
          <div class="sec-label" style="margin-bottom:8px">Il mio account</div>
          <h1 class="sec-title" style="margin-bottom:40px">Le mie prenotazioni</h1>

          <div v-if="!authStore.isAuthenticated" style="text-align:center;padding:48px 0">
            <p style="color:var(--gray-400);margin-bottom:20px">Accedi per vedere le tue prenotazioni.</p>
            <NuxtLink to="/login" class="btn btn-navy">Accedi</NuxtLink>
          </div>
          <div v-else-if="bookingStore.loading" style="text-align:center;padding:48px 0;color:var(--gray-400)">Caricamento…</div>
          <div v-else-if="bookingStore.bookings.length === 0" style="text-align:center;padding:48px 0;color:var(--gray-400)">
            <div style="font-size:3rem;margin-bottom:16px">🅿</div>
            <p style="margin-bottom:24px">Nessuna prenotazione ancora.</p>
            <NuxtLink to="/parcheggio" class="btn btn-navy">Prenota un posto</NuxtLink>
          </div>
          <div v-else>
            <div
              v-for="b in bookingStore.bookings" :key="b.id"
              style="background:white;border:1px solid #f0f0f0;border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px"
            >
              <div style="min-width:0">
                <div style="font-weight:700;font-size:14px;color:var(--navy-deep)">Posto {{ b.spot_identifier }} — {{ b.location_name }}</div>
                <div style="font-size:12px;color:#aaa;margin-top:4px">{{ fmtDate(b.start_time) }} → {{ fmtDate(b.end_time) }}</div>
                <div style="font-size:12px;font-weight:700;margin-top:4px;color:var(--navy)">€{{ b.price }}</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
                <span :class="statusClass(b.status)" style="padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700">{{ statusLabel(b.status) }}</span>
                <button v-if="b.status==='pending'" style="font-size:12px;font-weight:700;color:var(--navy);background:none;border:none;cursor:pointer" :disabled="bookingLoading" @click="pay(b.id)">Paga ora</button>
                <button v-if="b.status==='pending'" style="font-size:12px;font-weight:700;color:var(--red);background:none;border:none;cursor:pointer" :disabled="bookingLoading" @click="doCancel(b.id)">Annulla</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const route        = useRoute();
const authStore    = useAuthStore();
const parkingStore = useParkingStore();
const bookingStore = useBookingStore();
const { createBooking, fetchBookings, initiateCheckout, cancelBooking, loading: bookingLoading, error: bookingError } = useBookings();
const { fetchLocations } = useParking();

// ── Query params ──────────────────────────────────────────────────
const spotId      = computed(() => route.query.spot_id      as string || '');
const spotType    = computed(() => route.query.spot_type     as string || 'standard');
const locationId  = computed(() => route.query.location_id   as string || '');
const startTime   = computed(() => route.query.start_time    as string || '');
const endTime     = computed(() => route.query.end_time      as string || '');
const spotIdentifier = computed(() => route.query.spot_identifier as string || '');

// ── Form ──────────────────────────────────────────────────────────
const form = reactive({
  first_name:        authStore.user?.first_name ?? '',
  last_name:         authStore.user?.last_name  ?? '',
  email:             authStore.user?.email      ?? '',
  telefono:          '',
  modello_veicolo:   '',
  targa:             '',
  messaggio:         '',
  privacy:           false,
  orario_preso_nota: false,
  chiavi_preso_nota: false,
  fattura:           false,
});

// ── Computed ──────────────────────────────────────────────────────
const locationName = computed(
  () => parkingStore.locations.find(l => String(l.id) === locationId.value)?.name ?? 'Parcheggio'
);

const spotTypeLabels: Record<string, string> = {
  standard: 'Coperto Auto Standard', disabled: 'Posto Accessibile',
  ev: 'Coperto Elettrico', vip: 'Posto VIP', moto: 'Posto Moto', camper: 'Posto Camper',
};
const spotLabel = computed(() => spotTypeLabels[spotType.value] ?? spotIdentifier.value);

const PRICE_PER_DAY = 15;
const estimatedPrice = computed(() => {
  if (!startTime.value || !endTime.value) return '0,00';
  const days = Math.max(0, Math.round(
    (new Date(endTime.value).getTime() - new Date(startTime.value).getTime()) / 86_400_000
  ));
  return (days * PRICE_PER_DAY).toFixed(2).replace('.', ',');
});

// Treat "2026-05-20T00:00:00" as UTC midnight, never local time
function toUtcMidnight(s: string): string {
  const base = s.replace(/Z$/, '').slice(0, 10); // "2026-05-20"
  return `${base}T00:00:00Z`;
}

function fmtDate(dt: string) {
  if (!dt) return '';
  // Parse as UTC so the displayed date matches the booked date regardless of locale
  const [y, m, d] = (dt.slice(0, 10)).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });
}

// ── Actions ───────────────────────────────────────────────────────
async function confirmBooking() {
  if (!authStore.isAuthenticated) {
    navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  const booking = await createBooking({
    spot:       spotId.value,
    vehicle:    null,
    start_time: toUtcMidnight(startTime.value),
    end_time:   toUtcMidnight(endTime.value),
    notes:      form.messaggio || undefined,
  });
  if (!booking) return;
  navigateTo(`/booking/payment?booking_id=${booking.id}`);
}

async function pay(bookingId: string) {
  const url = await initiateCheckout(bookingId);
  if (url) navigateTo(url, { external: true });
}

async function doCancel(bookingId: string) {
  await cancelBooking(bookingId);
}

function statusClass(s: string) {
  return { pending: 'bg-amber-100 text-amber-700', paid: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-gray-100 text-gray-500' }[s] ?? 'bg-gray-100 text-gray-500';
}
function statusLabel(s: string) {
  return { pending: 'In attesa', paid: 'Pagata', cancelled: 'Annullata' }[s] ?? s;
}

onMounted(() => {
  fetchLocations();
  if (!spotId.value && authStore.isAuthenticated) fetchBookings();
});
</script>

<style scoped>
/* ── Stepper ───────────────────────────────────────────────────── */
.bk-stepper { border-bottom:1px solid #eee; background:#fff; padding:18px 0; }
.bk-stepper-inner { display:flex; align-items:center; max-width:400px; margin:0 auto; }
.bk-step { display:flex; flex-direction:column; align-items:center; gap:5px; text-decoration:none; cursor:default; }
.bk-step__num { width:30px; height:30px; border-radius:50%; border:2px solid #e0e0e0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#ccc; background:#fff; }
.bk-step__label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#ccc; }
.bk-step--done { cursor:pointer; }
.bk-step--done .bk-step__num   { border-color:var(--navy); background:var(--navy); color:#fff; }
.bk-step--done .bk-step__label { color:var(--navy); }
.bk-step--active .bk-step__num   { border-color:var(--navy); color:var(--navy); }
.bk-step--active .bk-step__label { color:var(--navy); }
.bk-step-line { flex:1; height:2px; background:#e0e0e0; margin:0 8px; margin-bottom:18px; }
.bk-step-line--done { background:var(--navy); }

/* ── Form ──────────────────────────────────────────────────────── */
.booking-form-wrap { max-width:680px; margin:0 auto; }
.booking-form-title { font-size:1.6rem; font-weight:700; color:var(--navy-deep); margin-bottom:28px; }

.bform-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }

.bform-input {
  width:100%; border:1px solid #e0e0e0; border-radius:8px; padding:12px 16px;
  font-size:.85rem; font-family:inherit; font-weight:500; color:#444;
  outline:none; background:#fff; transition:border-color .15s; box-sizing:border-box;
}
.bform-input:focus { border-color:var(--navy); }
.bform-textarea { display:block; resize:none; margin-bottom:12px; }

.bform-check { display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px; }
.bform-check input[type="checkbox"] { width:15px; height:15px; cursor:pointer; flex-shrink:0; }
.bform-check span { font-size:.75rem; color:#888; line-height:1.5; }

/* Riepilogo */
.bform-summary { margin-top:32px; border-top:1px solid #e8e8e8; padding-top:28px; }
.bform-summary-title { font-size:1.15rem; font-weight:700; color:#222; margin-bottom:20px; }
.bform-summary-row { display:grid; grid-template-columns:1.2fr 1fr 1fr 1fr; border:1px solid #e8e8e8; border-radius:10px; overflow:hidden; }
.bform-sum-col { padding:16px 18px; border-right:1px solid #e8e8e8; }
.bform-sum-col:last-child { border-right:none; }
.bform-sum-spot { display:flex; flex-direction:column; align-items:flex-start; gap:6px; }
.bform-sum-spot-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#555; line-height:1.3; }
.bform-sum-header { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#aaa; margin-bottom:10px; }
.bform-sum-val { display:flex; align-items:center; gap:6px; font-size:.82rem; color:#444; }
.bform-sum-val svg { opacity:.5; flex-shrink:0; }
.bform-pay-pill { display:inline-flex; align-items:center; gap:4px; background:#4caf50; color:#fff; font-weight:700; font-size:.85rem; padding:8px 14px; border-radius:8px; }

/* Info rows */
.bform-info-row { padding:18px 0; border-top:1px solid #f0f0f0; margin-top:8px; }
.bform-info-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#aaa; margin-bottom:6px; }
.bform-info-text { font-size:.78rem; color:#888; line-height:1.6; margin-bottom:10px; }

.bform-error { background:#fef2f2; color:#dc2626; font-size:.82rem; padding:12px 16px; border-radius:8px; margin-top:12px; margin-bottom:12px; }

.bform-confirm {
  display:block; width:100%; margin-top:24px; padding:16px;
  background:#4caf50; color:#fff; font-weight:700; font-size:.85rem;
  letter-spacing:.1em; text-transform:uppercase; border:none; border-radius:10px;
  cursor:pointer; transition:background .15s;
}
.bform-confirm:hover:not(:disabled) { background:#43a047; }
.bform-confirm:disabled { opacity:.4; cursor:not-allowed; }

@media (max-width:600px) {
  .bform-grid { grid-template-columns:1fr; }
  .bform-summary-row { grid-template-columns:1fr 1fr; }
  .bform-sum-col:nth-child(2n) { border-right:none; }
  .bform-sum-col:nth-child(n+3) { border-top:1px solid #e8e8e8; }
}
</style>
