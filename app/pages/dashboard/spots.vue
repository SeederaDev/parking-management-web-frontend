<template>
  <div class="max-w-4xl space-y-6">
    <!-- Add / Edit form -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 class="text-sm font-semibold text-navy-deep mb-5">
        {{ editing ? "Modifica posto" : "Aggiungi posto" }}
      </h2>
      <div v-if="formError" class="mb-4 bg-red-50 text-brand-red rounded-xl p-3 text-sm">{{ formError }}</div>

      <form class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" @submit.prevent="submit">
        <!-- Location -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Parcheggio</label>
          <select
            v-model="form.location"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          >
            <option value="">Seleziona…</option>
            <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
          </select>
        </div>

        <!-- Identifier -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Identificativo (es. A1, B12)</label>
          <input
            v-model="form.identifier"
            type="text"
            required
            placeholder="A1"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Tipologia</label>
          <select
            v-model="form.spot_type"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          >
            <option value="standard">Standard</option>
            <option value="disabled">Disabili</option>
            <option value="ev">Elettrico</option>
            <option value="vip">VIP</option>
            <option value="moto">Moto</option>
            <option value="camper">Camper</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Stato</label>
          <select
            v-model="form.status"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          >
            <option value="free">Libero</option>
            <option value="occupied">Occupato</option>
            <option value="reserved">Riservato</option>
            <option value="maintenance">Manutenzione</option>
          </select>
        </div>

        <!-- Floor -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Piano (opzionale)</label>
          <input
            v-model="form.floor"
            type="text"
            placeholder="P1, T, -1…"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Note (opzionale)</label>
          <input
            v-model="form.notes"
            type="text"
            placeholder="Colonnina ricarica, ingombro extra…"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        <!-- Actions -->
        <div class="sm:col-span-2 lg:col-span-3 flex items-center gap-3 justify-end pt-1">
          <button
            v-if="editing"
            type="button"
            class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
            @click="resetForm"
          >
            Annulla modifica
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-deep disabled:opacity-50 transition-colors"
          >
            {{ saving ? "Salvataggio…" : editing ? "Salva modifiche" : "Aggiungi posto" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Spots list -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-sm font-semibold text-navy-deep">
          Posti configurati
          <span v-if="allSpots.length" class="ml-2 text-xs font-normal text-gray-400">({{ allSpots.length }})</span>
        </h2>
        <!-- Location filter -->
        <select
          v-model="filterLocation"
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          @change="loadSpots"
        >
          <option value="">Tutti i parcheggi</option>
          <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-400">Caricamento…</div>
      <div v-else-if="!allSpots.length" class="text-center py-10 text-gray-400">Nessun posto configurato.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th class="pb-3 font-semibold">ID</th>
              <th class="pb-3 font-semibold">Parcheggio</th>
              <th class="pb-3 font-semibold">Tipo</th>
              <th class="pb-3 font-semibold">Piano</th>
              <th class="pb-3 font-semibold">Stato</th>
              <th class="pb-3 font-semibold">Note</th>
              <th class="pb-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="s in allSpots" :key="s.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 font-mono font-bold text-navy-deep">{{ s.identifier }}</td>
              <td class="py-3 text-gray-600">{{ s.location_name ?? locationName(s.location) }}</td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="typeClass(s.spot_type)">
                  {{ typeLabel(s.spot_type) }}
                </span>
              </td>
              <td class="py-3 text-gray-500">{{ s.floor ?? "—" }}</td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusClass(s.status)">
                  {{ statusLabel(s.status) }}
                </span>
              </td>
              <td class="py-3 text-gray-400 text-xs max-w-[160px] truncate">{{ s.notes ?? "—" }}</td>
              <td class="py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button
                    class="text-xs text-navy hover:text-navy-deep font-medium transition-colors"
                    @click="startEdit(s)"
                  >
                    Modifica
                  </button>
                  <button
                    class="text-xs text-brand-red hover:text-brand-red-hover font-medium transition-colors"
                    @click="remove(s.id)"
                  >
                    Elimina
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParkingSpot, SpotType, SpotStatus } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { loading, error, spots, fetchLocations, fetchSpots, createSpot, updateSpot, deleteSpot } = useParking();
const parkingStore = useParkingStore();

const locations = computed(() => parkingStore.locations);
const allSpots = computed(() => spots.value);
const filterLocation = ref("");
const saving = ref(false);
const formError = ref<string | null>(null);
const editingId = ref<string | null>(null);
const editing = computed(() => editingId.value !== null);

const form = reactive({
  location: "",
  identifier: "",
  spot_type: "standard" as SpotType,
  status: "free" as SpotStatus,
  floor: "",
  notes: "",
});

function resetForm() {
  editingId.value = null;
  form.location = "";
  form.identifier = "";
  form.spot_type = "standard";
  form.status = "free";
  form.floor = "";
  form.notes = "";
  formError.value = null;
}

function startEdit(s: ParkingSpot) {
  editingId.value = s.id;
  form.location = s.location;
  form.identifier = s.identifier;
  form.spot_type = s.spot_type;
  form.status = s.status;
  form.floor = s.floor ?? "";
  form.notes = s.notes ?? "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function submit() {
  formError.value = null;
  saving.value = true;
  try {
    const payload = {
      location: form.location,
      identifier: form.identifier,
      spot_type: form.spot_type,
      status: form.status,
      floor: form.floor || undefined,
      notes: form.notes || undefined,
    };
    if (editing.value) {
      await updateSpot(editingId.value!, payload);
    } else {
      await createSpot(payload as Omit<ParkingSpot, "id">);
    }
    await loadSpots();
    resetForm();
  } catch (err: unknown) {
    formError.value = "Errore durante il salvataggio. Verifica i dati inseriti.";
  } finally {
    saving.value = false;
  }
}

async function remove(id: string) {
  await deleteSpot(id);
  await loadSpots();
}

async function loadSpots() {
  await fetchSpots(filterLocation.value || undefined);
}

function locationName(id: string) {
  return locations.value.find((l) => l.id === id)?.name ?? id;
}

function typeLabel(t: SpotType) {
  return { standard: "Standard", disabled: "Disabili", ev: "Elettrico", vip: "VIP", moto: "Moto", camper: "Camper" }[t] ?? t;
}

function typeClass(t: SpotType) {
  return (
    { standard: "bg-gray-100 text-gray-700", disabled: "bg-blue-100 text-blue-700", ev: "bg-emerald-100 text-emerald-700", vip: "bg-brand-gold/20 text-amber-800", moto: "bg-purple-100 text-purple-700", camper: "bg-orange-100 text-orange-700" }[t] ?? "bg-gray-100 text-gray-700"
  );
}

function statusLabel(s: SpotStatus) {
  return { free: "Libero", occupied: "Occupato", reserved: "Riservato", maintenance: "Manutenzione" }[s] ?? s;
}

function statusClass(s: SpotStatus) {
  return (
    { free: "bg-emerald-100 text-emerald-800", occupied: "bg-red-100 text-red-800", reserved: "bg-amber-100 text-amber-800", maintenance: "bg-gray-100 text-gray-600" }[s] ?? "bg-gray-100 text-gray-600"
  );
}

onMounted(async () => {
  await fetchLocations();
  await loadSpots();
});
</script>
