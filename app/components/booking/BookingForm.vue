<template>
  <div class="booking-form-wrap">
    <!-- Location heading -->
    <h2 class="booking-form-title">{{ locationName }}</h2>

    <!-- Personal info fields -->
    <div class="bform-grid">
      <input v-model="form.first_name"      type="text"              class="bform-input" />
      <input v-model="form.last_name"       type="text"           class="bform-input" />
      <input v-model="form.telefono"        type="tel"          class="bform-input" />
      <input v-model="form.email"           type="email"              class="bform-input" />
      <input v-model="form.modello_veicolo" type="text" class="bform-input" />
      <input v-model="form.targa"           type="text"             class="bform-input" />
    </div>
    <textarea
      v-model="form.messaggio"
      rows="3"
      class="bform-input bform-textarea"
    />
    <label class="bform-check">
      <input v-model="form.privacy" type="checkbox" />
      <span>Acconsento al trattamento dei dati personali ai sensi della <a href="/privacy" style="color:var(--navy);text-decoration:underline">Privacy Policy</a></span>
    </label>

    <!-- Riepilogo prenotazione -->
    <div class="bform-summary">
      <h3 class="bform-summary-title">Riepilogo prenotazione</h3>
      <div class="bform-summary-row">
        <!-- Spot type -->
        <div class="bform-sum-col bform-sum-spot">
          <svg
            viewBox="0 0 24 24"
            width="52"
            height="36"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color:var(--navy)"
            v-html="spotSvg"
          />
          <div class="bform-sum-spot-label">{{ spotLabel }}</div>
        </div>
        <!-- Entry -->
        <div class="bform-sum-col">
          <div class="bform-sum-header">Data Ingresso</div>
          <div class="bform-sum-val">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {{ formatDate(startTime) }}
          </div>
        </div>
        <!-- Exit -->
        <div class="bform-sum-col">
          <div class="bform-sum-header">Data Uscita</div>
          <div class="bform-sum-val">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {{ formatDate(endTime) }}
          </div>
        </div>
        <!-- Pay online -->
        <div class="bform-sum-col">
          <div class="bform-sum-header">Paga Online</div>
          <div class="bform-pay-pill">€ {{ estimatedPrice }} ›</div>
        </div>
      </div>
    </div>

    <!-- Orario di apertura -->
    <div class="bform-info-row">
      <div class="bform-info-label">Orario di Apertura</div>
      <p class="bform-info-text">
        Dal Lunedì al Sabato dalle 06:00 all'1:00. Domenica e festivi dalle 06:00 alle 10:00 e dalle 18:00 all'1:00.
      </p>
      <label class="bform-check">
        <input v-model="form.orario_preso_nota" type="checkbox" />
        <span>Ho preso nota dell'orario ridotto del parcheggio.</span>
      </label>
    </div>

    <!-- Chiavi -->
    <div class="bform-info-row">
      <div class="bform-info-label">Altre Informazioni</div>
      <p class="bform-info-text">Le chiavi del veicolo devono essere consegnate agli addetti.</p>
      <label class="bform-check">
        <input v-model="form.chiavi_preso_nota" type="checkbox" />
        <span>Ho preso nota della consegna delle chiavi.</span>
      </label>
    </div>

    <!-- Fattura -->
    <div class="bform-info-row">
      <div class="bform-info-label">Altre Informazioni</div>
      <label class="bform-check">
        <input v-model="form.fattura" type="checkbox" />
        <span>Richiedi fattura</span>
      </label>
    </div>

    <div v-if="bookingError" class="bform-error">{{ bookingError }}</div>

    <!-- Confirm -->
    <button
      :disabled="bookingLoading || !form.privacy"
      class="bform-confirm"
      @click="confirmBooking"
    >
      {{ bookingLoading ? 'Creazione prenotazione…' : 'Conferma' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  spotId: string;
  spotIdentifier: string;
  spotType: string;
  locationId: string;
  startTime: string;
  endTime: string;
}>();

const emit = defineEmits<{ confirmed: [] }>();

const authStore    = useAuthStore();
const parkingStore = useParkingStore();
const { createBooking, loading: bookingLoading, error: bookingError } = useBookings();

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

const locationName = computed(
  () => parkingStore.locations.find(l => String(l.id) === props.locationId)?.name ?? 'Parcheggio'
);

const CAR_SVG   = `<path stroke="currentColor" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3-5H9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle stroke="currentColor" cx="7" cy="17" r="2"/><circle stroke="currentColor" cx="17" cy="17" r="2"/><path stroke="currentColor" d="M14 17H10"/>`;
const TRUCK_SVG = `<rect stroke="currentColor" x="1" y="3" width="15" height="13"/><polygon stroke="currentColor" points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle stroke="currentColor" cx="5.5" cy="18.5" r="2.5"/><circle stroke="currentColor" cx="18.5" cy="18.5" r="2.5"/>`;

const typeConfig: Record<string, { label: string; svg: string }> = {
  standard: { label: 'Coperto Auto Standard', svg: CAR_SVG },
  disabled: { label: 'Posto Accessibile',     svg: CAR_SVG },
  ev:       { label: 'Coperto Elettrico',      svg: CAR_SVG },
  vip:      { label: 'Posto VIP',              svg: CAR_SVG },
  moto:     { label: 'Posto Moto',             svg: CAR_SVG },
  camper:   { label: 'Posto Camper',           svg: TRUCK_SVG },
};

const spotLabel = computed(() => typeConfig[props.spotType]?.label ?? props.spotIdentifier);
const spotSvg   = computed(() => typeConfig[props.spotType]?.svg   ?? CAR_SVG);

const PRICE_PER_DAY = 15;
const estimatedPrice = computed(() => {
  const start = new Date(props.startTime);
  const end   = new Date(props.endTime);
  const days  = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  return (days * PRICE_PER_DAY).toFixed(2).replace('.', ',');
});

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function confirmBooking() {
  const booking = await createBooking({
    spot:       props.spotId,
    vehicle:    null,
    start_time: new Date(props.startTime).toISOString(),
    end_time:   new Date(props.endTime).toISOString(),
  });
  if (!booking) return;
  emit('confirmed');
  navigateTo(`/booking/payment?booking_id=${booking.id}`);
}
</script>

<style scoped>
.booking-form-wrap {
  max-width: 680px;
  margin: 0 auto;
}

.booking-form-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--navy-deep);
  margin-bottom: 28px;
}

.bform-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.bform-input {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.8rem;
  font-family: inherit;
  letter-spacing: 0.06em;
  font-weight: 500;
  color: #444;
  outline: none;
  background: #fff;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.bform-input::placeholder { color: #aaa; }
.bform-input:focus { border-color: var(--navy); }

.bform-textarea {
  display: block;
  resize: none;
  margin-bottom: 12px;
}

.bform-check {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 8px;
}
.bform-check input[type="checkbox"] { width: 15px; height: 15px; cursor: pointer; }
.bform-check span { font-size: 0.75rem; color: #888; }

/* Riepilogo */
.bform-summary {
  margin-top: 32px;
  border-top: 1px solid #e8e8e8;
  padding-top: 28px;
  margin-bottom: 0;
}

.bform-summary-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
}

.bform-summary-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  gap: 0;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
}

.bform-sum-col {
  padding: 16px 18px;
  border-right: 1px solid #e8e8e8;
}
.bform-sum-col:last-child { border-right: none; }

.bform-sum-spot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.bform-sum-spot-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #555;
  line-height: 1.3;
}

.bform-sum-header {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #aaa;
  margin-bottom: 10px;
}

.bform-sum-val {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #444;
}
.bform-sum-val svg { opacity: 0.5; flex-shrink: 0; }

.bform-pay-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #4caf50;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: default;
}

/* Info rows */
.bform-info-row {
  padding: 18px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.bform-info-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #aaa;
  margin-bottom: 6px;
}

.bform-info-text {
  font-size: 0.78rem;
  color: #888;
  line-height: 1.6;
  margin-bottom: 10px;
}

.bform-error {
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.82rem;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.bform-confirm {
  display: block;
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background: #4caf50;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.bform-confirm:hover:not(:disabled) { background: #43a047; }
.bform-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 600px) {
  .bform-grid { grid-template-columns: 1fr; }
  .bform-summary-row { grid-template-columns: 1fr 1fr; }
  .bform-sum-col:nth-child(2n) { border-right: none; }
  .bform-sum-col:nth-child(n+3) { border-top: 1px solid #e8e8e8; }
}
</style>
