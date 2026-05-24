<template>
  <div>
    <!-- Stepper -->
    <div class="bk-stepper">
      <div class="container">
        <div class="bk-stepper-inner">
          <NuxtLink to="/noleggio" class="bk-step bk-step--done">
            <span class="bk-step__num">1</span>
            <span class="bk-step__label">Veicolo</span>
          </NuxtLink>
          <div class="bk-step-line bk-step-line--done" />
          <div class="bk-step bk-step--active">
            <span class="bk-step__num">2</span>
            <span class="bk-step__label">Prenotazione</span>
          </div>
          <div class="bk-step-line" />
          <div class="bk-step">
            <span class="bk-step__num">3</span>
            <span class="bk-step__label">Pagamento</span>
          </div>
        </div>
      </div>
    </div>

    <section>
      <div class="container">
        <div class="booking-form-wrap">

          <!-- Vehicle heading -->
          <h2 class="booking-form-title">{{ vehicleName }}</h2>

          <!-- Personal info -->
          <div class="bform-grid">
            <div class="bform-field">
              <label class="bform-label">Nome</label>
              <input v-model="form.first_name" type="text" class="bform-input" />
            </div>
            <div class="bform-field">
              <label class="bform-label">Cognome</label>
              <input v-model="form.last_name" type="text" class="bform-input" />
            </div>
            <div class="bform-field">
              <label class="bform-label">Telefono</label>
              <input v-model="form.telefono" type="tel" class="bform-input" />
            </div>
            <div class="bform-field">
              <label class="bform-label">Email</label>
              <input v-model="form.email" type="email" class="bform-input" />
            </div>
          </div>
          <div class="bform-field" style="margin-bottom:12px">
            <label class="bform-label">Note</label>
            <textarea v-model="form.notes" rows="3" class="bform-input bform-textarea" style="margin-bottom:0" />
          </div>
          <label class="bform-check">
            <input v-model="form.privacy" type="checkbox" />
            <span>Acconsento al trattamento dei dati ai sensi della <a href="/privacy" style="color:var(--navy);text-decoration:underline">Privacy Policy</a></span>
          </label>

          <!-- Riepilogo -->
          <div class="bform-summary">
            <h3 class="bform-summary-title">Riepilogo prenotazione</h3>
            <div class="bform-summary-row">
              <div class="bform-sum-col bform-sum-spot">
                <svg viewBox="0 0 24 24" width="52" height="36" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--navy)">
                  <path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                  <circle stroke="currentColor" cx="7" cy="17" r="2"/><circle stroke="currentColor" cx="17" cy="17" r="2"/>
                  <path stroke="currentColor" d="M14 17H10"/>
                </svg>
                <div class="bform-sum-spot-label">{{ vehicleName }}</div>
              </div>
              <div class="bform-sum-col">
                <div class="bform-sum-header">Data Ritiro</div>
                <div class="bform-sum-val">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {{ fmtDate(startDate) }}
                </div>
              </div>
              <div class="bform-sum-col">
                <div class="bform-sum-header">Data Riconsegna</div>
                <div class="bform-sum-val">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {{ fmtDate(endDate) }}
                </div>
              </div>
              <div class="bform-sum-col">
                <div class="bform-sum-header">Totale</div>
                <div class="bform-pay-pill">€ {{ totalPrice }} ›</div>
              </div>
            </div>
          </div>

          <!-- Cancellation policy -->
          <div class="bform-info-row">
            <div class="bform-info-label">Politica di Cancellazione</div>
            <p class="bform-info-text">
              Cancellazione gratuita fino a <strong>10 giorni prima</strong> del ritiro.
              Dal 5° al 10° giorno, penale del 20%.
              Meno di 5 giorni prima: non rimborsabile.
            </p>
          </div>

          <div v-if="bookingError" class="bform-error">{{ bookingError }}</div>

          <button :disabled="loading || !form.privacy" class="bform-confirm" @click="confirmBooking">
            {{ loading ? 'Prenotazione in corso…' : 'Conferma e procedi al pagamento' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
useHead({ title: "Prenota noleggio — Palmieri & Treglia" });

const route      = useRoute();
const authStore  = useAuthStore();
const api        = useApi();

const vehicleId   = computed(() => route.query.vehicle_id as string);
const vehicleName = computed(() => route.query.vehicle_name as string || 'Veicolo');
const startDate   = computed(() => route.query.start_date as string || '');
const endDate     = computed(() => route.query.end_date   as string || '');
const pricePerDay = computed(() => parseFloat(route.query.price as string || '0'));

const totalPrice = computed(() => {
  if (!startDate.value || !endDate.value) return '0,00';
  const d = Math.max(1, Math.round((new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) / 86400000));
  return (d * pricePerDay.value).toFixed(2).replace('.', ',');
});

const form = reactive({
  first_name: authStore.user?.first_name ?? '',
  last_name:  authStore.user?.last_name  ?? '',
  email:      authStore.user?.email      ?? '',
  telefono:   '',
  notes:      '',
  privacy:    false,
});

const loading      = ref(false);
const bookingError = ref<string | null>(null);

function fmtDate(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  });
}

async function confirmBooking() {
  if (!authStore.isAuthenticated) {
    navigateTo(`/login?redirect=${encodeURIComponent(useRoute().fullPath)}`);
    return;
  }
  loading.value      = true;
  bookingError.value = null;
  try {
    const booking = await api<{ id: string }>('/bookings/rental/', {
      method: 'POST',
      body: {
        vehicle:    vehicleId.value,
        start_time: `${startDate.value}T00:00:00Z`,
        end_time:   `${endDate.value}T00:00:00Z`,
        notes:      form.notes || undefined,
      },
    });
    navigateTo(`/booking/payment?booking_id=${booking.id}`);
  } catch (e: any) {
    bookingError.value = e?.data?.error ?? 'Errore nella prenotazione. Riprova.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Stepper */
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

/* Form (shared with parking booking) */
.booking-form-wrap { max-width:680px; margin:0 auto; }
.booking-form-title { font-size:1.6rem; font-weight:700; color:var(--navy-deep); margin-bottom:28px; }
.bform-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.bform-field { display:flex; flex-direction:column; gap:5px; }
.bform-label { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#aaa; }
.bform-input { width:100%; border:1px solid #e0e0e0; border-radius:8px; padding:12px 16px; font-size:.85rem; font-family:inherit; font-weight:500; color:#444; outline:none; background:#fff; transition:border-color .15s; box-sizing:border-box; }
.bform-input:focus { border-color:var(--navy); }
.bform-textarea { display:block; resize:none; margin-bottom:12px; }
.bform-check { display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px; }
.bform-check input[type="checkbox"] { width:15px; height:15px; cursor:pointer; flex-shrink:0; }
.bform-check span { font-size:.75rem; color:#888; line-height:1.5; }
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
.bform-info-row { padding:18px 0; border-top:1px solid #f0f0f0; margin-top:8px; }
.bform-info-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#aaa; margin-bottom:6px; }
.bform-info-text { font-size:.78rem; color:#888; line-height:1.6; margin-bottom:10px; }
.bform-error { background:#fef2f2; color:#dc2626; font-size:.82rem; padding:12px 16px; border-radius:8px; margin-top:12px; }
.bform-confirm { display:block; width:100%; margin-top:24px; padding:16px; background:#4caf50; color:#fff; font-weight:700; font-size:.85rem; letter-spacing:.1em; text-transform:uppercase; border:none; border-radius:10px; cursor:pointer; transition:background .15s; }
.bform-confirm:hover:not(:disabled) { background:#43a047; }
.bform-confirm:disabled { opacity:.4; cursor:not-allowed; }
@media (max-width:600px) {
  .bform-grid { grid-template-columns:1fr; }
  .bform-summary-row { grid-template-columns:1fr 1fr; }
}
</style>
