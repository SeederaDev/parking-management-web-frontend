<script setup lang="ts">
definePageMeta({ layout: "site" });
useHead({ title: "Noleggio Auto - Palmieri & Treglia" });

const api = useApi();
interface VehicleImage { id: string; image: string; is_primary: boolean; }
interface Vehicle {
  id: string; name: string; model: string; description: string;
  price_per_day: string; is_available: boolean; images: VehicleImage[];
}

const vehicles = ref<Vehicle[]>([]);
const loading  = ref(true);

onMounted(async () => {
  try {
    const data = await api<{ results: Vehicle[] }>('/vehicles/?available=true');
    vehicles.value = (data.results ?? data) as Vehicle[];
  } catch { /* show empty */ } finally { loading.value = false; }
});

function primaryImage(v: Vehicle) {
  return v.images?.find(i => i.is_primary)?.image ?? v.images?.[0]?.image ?? null;
}

// Date picker modal
const showModal   = ref(false);
const activeVehicle = ref<Vehicle | null>(null);
const startDate   = ref('');
const endDate     = ref('');
const dateError   = ref('');

function openBooking(v: Vehicle) {
  activeVehicle.value = v;
  startDate.value = '';
  endDate.value   = '';
  dateError.value = '';
  showModal.value = true;
}

function days() {
  if (!startDate.value || !endDate.value) return 0;
  return Math.max(0, Math.round((new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) / 86400000));
}

function totalPrice() {
  if (!activeVehicle.value) return '0,00';
  return (days() * parseFloat(activeVehicle.value.price_per_day)).toFixed(2).replace('.', ',');
}

const router = useRouter();
function proceedToBook() {
  dateError.value = '';
  if (!startDate.value || !endDate.value) { dateError.value = 'Seleziona le date.'; return; }
  if (days() < 1) { dateError.value = 'La data di riconsegna deve essere successiva al ritiro.'; return; }
  showModal.value = false;
  router.push({
    path: '/noleggio/book',
    query: {
      vehicle_id:  activeVehicle.value!.id,
      vehicle_name: `${activeVehicle.value!.name} ${activeVehicle.value!.model}`,
      start_date:  startDate.value,
      end_date:    endDate.value,
      price:       activeVehicle.value!.price_per_day,
    },
  });
}

// Min date = tomorrow
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const minDate  = tomorrow.toISOString().slice(0, 10);
</script>

<template>
  <div class="page">
    <SiteSubHero
      label="Noleggio"
      title="Noleggio Auto a Formia"
      description="Ampia flotta per ogni esigenza, dalle city car ai SUV, per privati e aziende."
    />

    <section>
      <div class="container">
        <div class="sec-label" data-reveal>La nostra flotta</div>
        <div class="sec-title" data-reveal>Scegli l'auto giusta per te.</div>
        <div class="sec-desc" data-reveal="delay-1">
          Tariffe giornaliere trasparenti. Cancellazione gratuita fino a 10 giorni prima del ritiro.
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16" style="color:var(--gray-400)">Caricamento…</div>

        <!-- No vehicles yet -->
        <div v-else-if="!vehicles.length" class="text-center py-16" style="color:var(--gray-400)">
          <p>Nessun veicolo disponibile al momento.</p>
          <p class="mt-2 text-sm">Contattaci per disponibilità: <a href="tel:077123652" style="color:var(--navy)">0771 23652</a></p>
        </div>

        <!-- Vehicle grid -->
        <div v-else class="rent-grid mt-48">
          <div
            v-for="(v, i) in vehicles"
            :key="v.id"
            class="rent-card"
            :data-reveal="i ? `delay-${Math.min(i,5)}` : ''"
          >
            <div class="rent-card-img">
              <img v-if="primaryImage(v)" :src="primaryImage(v)!" :alt="v.name" style="width:100%;height:100%;object-fit:cover;display:block" />
              <div v-else class="img-placeholder"><span>{{ v.name }}</span></div>
            </div>
            <div class="rent-card-body">
              <div class="cat">€ {{ v.price_per_day }} / giorno</div>
              <h4>{{ v.name }}</h4>
              <p v-if="v.model" style="font-weight:600;color:var(--gray-600);margin-bottom:6px">{{ v.model }}</p>
              <p v-if="v.description">{{ v.description }}</p>
              <button class="btn btn-navy mt-24" style="width:100%;justify-content:center" @click="openBooking(v)">
                Prenota
              </button>
            </div>
          </div>
        </div>

        <!-- Cancellation policy note -->
        <div class="mt-80 max-640" data-reveal>
          <div class="sec-label">Disdetta e rimborsi</div>
          <div class="about-text">
            <p>Cancellazione gratuita fino a <strong>10 giorni prima</strong> del ritiro. Dal 5° al 10° giorno, penale del 20%. Meno di 5 giorni prima: non rimborsabile.</p>
            <p>Il pagamento è sempre richiesto online al momento della prenotazione.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Date picker modal -->
    <Teleport to="body">
      <div v-if="showModal" class="dp-backdrop" @click.self="showModal = false">
        <div class="dp-box">
          <div class="dp-header">
            <div>
              <div style="font-size:.75rem;color:#aaa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px">Noleggio</div>
              <div style="font-weight:700;color:var(--navy-deep)">{{ activeVehicle?.name }} {{ activeVehicle?.model }}</div>
            </div>
            <button style="background:none;border:none;font-size:1.2rem;color:#aaa;cursor:pointer" @click="showModal = false">✕</button>
          </div>

          <div class="dp-body">
            <div class="dp-dates">
              <div class="dp-date-field">
                <label>Data ritiro</label>
                <input v-model="startDate" type="date" :min="minDate" />
              </div>
              <div class="dp-date-field">
                <label>Data riconsegna</label>
                <input v-model="endDate" type="date" :min="startDate || minDate" />
              </div>
            </div>

            <div v-if="days() > 0" class="dp-summary">
              <span>{{ days() }} {{ days() === 1 ? 'giorno' : 'giorni' }}</span>
              <span class="dp-price">€ {{ totalPrice() }}</span>
            </div>

            <p v-if="dateError" style="color:#dc2626;font-size:.8rem;margin-bottom:12px">{{ dateError }}</p>

            <button class="btn btn-navy" style="width:100%;justify-content:center" @click="proceedToBook">
              Continua
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.dp-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.dp-box {
  background: #fff; border-radius: 16px; width: 100%; max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,.18);
}
.dp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;
}
.dp-body { padding: 20px 24px 24px; }
.dp-dates { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.dp-date-field label { display: block; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #aaa; margin-bottom: 5px; }
.dp-date-field input { width: 100%; border: 1px solid #e0e0e0; border-radius: 8px; padding: 9px 12px; font-size: .85rem; font-family: inherit; outline: none; }
.dp-date-field input:focus { border-color: var(--navy); }
.dp-summary {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--off-white); border-radius: 10px; padding: 12px 16px;
  margin-bottom: 16px; font-size: .85rem; color: var(--gray-600);
}
.dp-price { font-size: 1.1rem; font-weight: 800; color: var(--navy); }
</style>
