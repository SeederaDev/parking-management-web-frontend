<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-navy-deep">Noleggio Auto</h1>
        <p class="text-sm text-gray-400 mt-0.5">Gestisci il parco veicoli disponibile al noleggio.</p>
      </div>
      <button class="btn-dash-primary" @click="openCreate">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Aggiungi veicolo
      </button>
    </div>

    <!-- Vehicle grid -->
    <div v-if="loading" class="text-center py-16 text-gray-400 text-sm">Caricamento…</div>
    <div v-else-if="!vehicles.length" class="text-center py-16 text-gray-400 text-sm">
      <div class="text-4xl mb-3">🚗</div>
      <p>Nessun veicolo ancora. Aggiungine uno.</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="v in vehicles" :key="v.id"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
      >
        <!-- Image area -->
        <div class="relative bg-gray-50 aspect-video flex items-center justify-center overflow-hidden">
          <img
            v-if="primaryImage(v)"
            :src="primaryImage(v)"
            :alt="v.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-gray-300 text-5xl">🚗</div>
          <div
            class="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100 gap-2"
          >
            <button class="bg-white text-navy-deep text-xs font-semibold px-3 py-1.5 rounded-lg shadow" @click="openImages(v)">
              Gestisci foto
            </button>
          </div>
          <div v-if="!v.is_available" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Non disponibile
          </div>
        </div>

        <!-- Info -->
        <div class="p-4 flex-1 flex flex-col">
          <div class="font-bold text-navy-deep text-sm">{{ v.name }}</div>
          <div class="text-xs text-gray-400 mt-0.5 mb-2">{{ v.model }}</div>
          <p v-if="v.description" class="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{{ v.description }}</p>
          <div class="mt-auto flex items-center justify-between">
            <span class="text-sm font-bold text-navy">€ {{ v.price_per_day }}<span class="font-normal text-gray-400 text-xs">/giorno</span></span>
            <div class="flex gap-2">
              <button class="btn-dash-sm" @click="openEdit(v)">Modifica</button>
              <button class="btn-dash-sm btn-dash-sm--danger" @click="confirmDelete(v)">Elimina</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form modal (create / edit) -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2>{{ editing ? 'Modifica veicolo' : 'Nuovo veicolo' }}</h2>
            <button class="modal-close" @click="showForm = false">✕</button>
          </div>
          <form class="modal-body" @submit.prevent="saveVehicle">
            <div class="form-row-2">
              <div class="field">
                <label>Nome</label>
                <input v-model="form.name" type="text" required />
              </div>
              <div class="field">
                <label>Modello</label>
                <input v-model="form.model" type="text" required />
              </div>
            </div>
            <div class="field">
              <label>Descrizione</label>
              <textarea v-model="form.description" rows="3" />
            </div>
            <div class="form-row-2">
              <div class="field">
                <label>Prezzo al giorno (€)</label>
                <input v-model="form.price_per_day" type="number" step="0.01" min="0" required />
              </div>
              <div class="field field--check">
                <label class="check-label">
                  <input v-model="form.is_available" type="checkbox" />
                  <span>Disponibile al noleggio</span>
                </label>
              </div>
            </div>
            <div v-if="formError" class="form-error">{{ formError }}</div>
            <div class="modal-footer">
              <button type="button" class="btn-dash-cancel" @click="showForm = false">Annulla</button>
              <button type="submit" class="btn-dash-primary" :disabled="saving">
                {{ saving ? 'Salvataggio…' : 'Salva' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Image manager modal -->
    <Teleport to="body">
      <div v-if="showImages && activeVehicle" class="modal-backdrop" @click.self="closeImages">
        <div class="modal-box modal-box--wide">
          <div class="modal-header">
            <h2>Foto — {{ activeVehicle.name }}</h2>
            <button class="modal-close" @click="closeImages">✕</button>
          </div>
          <div class="modal-body">
            <!-- Existing images -->
            <div v-if="activeVehicle.images.length" class="img-grid">
              <div v-for="img in activeVehicle.images" :key="img.id" class="img-card">
                <img :src="img.image" :alt="activeVehicle.name" class="img-card__img" />
                <div class="img-card__actions">
                  <button
                    v-if="!img.is_primary"
                    class="img-action"
                    title="Imposta come principale"
                    @click="setPrimary(img.id)"
                  >⭐</button>
                  <span v-else class="img-action img-action--primary" title="Foto principale">⭐</span>
                  <button class="img-action img-action--del" title="Elimina" @click="deleteImage(img.id)">✕</button>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-400 mb-4">Nessuna foto ancora.</p>

            <!-- Upload -->
            <label class="upload-area" :class="{ 'upload-area--over': dragOver }"
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop.prevent="onDrop"
            >
              <input ref="fileInput" type="file" accept="image/*" multiple class="sr-only" @change="onFileChange" />
              <div class="upload-area__icon">📷</div>
              <div class="upload-area__text">Trascina le foto qui oppure <span class="upload-area__link">sfoglia</span></div>
              <div class="upload-area__sub">JPG, PNG, WEBP — max 5 MB ciascuna</div>
            </label>

            <div v-if="uploading" class="text-sm text-gray-400 mt-3 text-center">Caricamento in corso…</div>
            <div v-if="imageError" class="form-error mt-3">{{ imageError }}</div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal-box modal-box--sm">
          <div class="modal-header">
            <h2>Elimina veicolo</h2>
            <button class="modal-close" @click="deleteTarget = null">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-sm text-gray-600">Vuoi eliminare <strong>{{ deleteTarget.name }}</strong>? L'operazione non è reversibile.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-dash-cancel" @click="deleteTarget = null">Annulla</button>
            <button class="btn-dash-primary" style="background:#dc2626" :disabled="saving" @click="doDelete">
              {{ saving ? 'Eliminazione…' : 'Elimina' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types';

definePageMeta({ layout: 'dashboard', middleware: 'admin' });
useHead({ title: 'Noleggio Auto — Dashboard' });

const api = useApi();
const config = useRuntimeConfig();

const vehicles     = ref<Vehicle[]>([]);
const loading      = ref(true);
const saving       = ref(false);
const showForm     = ref(false);
const showImages   = ref(false);
const editing      = ref<Vehicle | null>(null);
const activeVehicle = ref<Vehicle | null>(null);
const deleteTarget = ref<Vehicle | null>(null);
const uploading    = ref(false);
const dragOver     = ref(false);
const formError    = ref<string | null>(null);
const imageError   = ref<string | null>(null);
const fileInput    = ref<HTMLInputElement | null>(null);

const form = reactive({
  name:          '',
  model:         '',
  description:   '',
  price_per_day: '',
  is_available:  true,
});

const apiBase = config.public.apiBase as string;

async function load() {
  loading.value = true;
  try {
    const data = await api<{ results: Vehicle[] }>('/vehicles/');
    vehicles.value = data.results ?? (data as unknown as Vehicle[]);
  } finally {
    loading.value = false;
  }
}

function primaryImage(v: Vehicle) {
  const pri = v.images?.find(i => i.is_primary) ?? v.images?.[0];
  return pri?.image ?? null;
}

function openCreate() {
  editing.value = null;
  Object.assign(form, { name: '', model: '', description: '', price_per_day: '', is_available: true });
  formError.value = null;
  showForm.value = true;
}

function openEdit(v: Vehicle) {
  editing.value = v;
  Object.assign(form, {
    name:          v.name,
    model:         v.model,
    description:   v.description ?? '',
    price_per_day: v.price_per_day,
    is_available:  v.is_available,
  });
  formError.value = null;
  showForm.value = true;
}

async function saveVehicle() {
  saving.value = true;
  formError.value = null;
  try {
    if (editing.value) {
      const updated = await api<Vehicle>(`/vehicles/${editing.value.id}/`, { method: 'PATCH', body: form });
      const idx = vehicles.value.findIndex(v => v.id === editing.value!.id);
      if (idx !== -1) vehicles.value[idx] = { ...vehicles.value[idx], ...updated };
    } else {
      const created = await api<Vehicle>('/vehicles/', { method: 'POST', body: form });
      vehicles.value.unshift(created);
    }
    showForm.value = false;
  } catch {
    formError.value = 'Errore nel salvataggio. Controlla i dati.';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(v: Vehicle) { deleteTarget.value = v; }

async function doDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await api(`/vehicles/${deleteTarget.value.id}/`, { method: 'DELETE' });
    vehicles.value = vehicles.value.filter(v => v.id !== deleteTarget.value!.id);
    deleteTarget.value = null;
  } finally {
    saving.value = false;
  }
}

function openImages(v: Vehicle) {
  activeVehicle.value = vehicles.value.find(x => x.id === v.id) ?? v;
  imageError.value = null;
  showImages.value = true;
}

function closeImages() {
  showImages.value = false;
  activeVehicle.value = null;
}

async function uploadFiles(files: File[]) {
  if (!activeVehicle.value) return;
  uploading.value = true;
  imageError.value = null;
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = `${file.name} supera i 5 MB.`;
      continue;
    }
    const fd = new FormData();
    fd.append('image', file);
    try {
      const img = await api<{ id: string; image: string; is_primary: boolean }>(
        `/vehicles/${activeVehicle.value.id}/images/`,
        { method: 'POST', body: fd }
      );
      const v = vehicles.value.find(x => x.id === activeVehicle.value!.id);
      if (v) {
        v.images = [...(v.images ?? []), img];
        activeVehicle.value = v;
      }
    } catch {
      imageError.value = 'Errore nel caricamento di ' + file.name;
    }
  }
  uploading.value = false;
}

function onFileChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? []);
  if (files.length) uploadFiles(files);
}

function onDrop(e: DragEvent) {
  dragOver.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []);
  if (files.length) uploadFiles(files);
}

async function deleteImage(imgId: string) {
  if (!activeVehicle.value) return;
  try {
    await api(`/vehicles/${activeVehicle.value.id}/images/${imgId}/`, { method: 'DELETE' });
    const v = vehicles.value.find(x => x.id === activeVehicle.value!.id);
    if (v) {
      v.images = v.images.filter(i => i.id !== imgId);
      activeVehicle.value = v;
    }
  } catch {
    imageError.value = 'Errore nell\'eliminazione.';
  }
}

async function setPrimary(imgId: string) {
  if (!activeVehicle.value) return;
  try {
    await api(`/vehicles/${activeVehicle.value.id}/images/${imgId}/set-primary/`, { method: 'PATCH' });
    const v = vehicles.value.find(x => x.id === activeVehicle.value!.id);
    if (v) {
      v.images = v.images.map(i => ({ ...i, is_primary: i.id === imgId }));
      activeVehicle.value = v;
    }
  } catch {
    imageError.value = 'Errore nell\'aggiornamento.';
  }
}

onMounted(load);
</script>

<style scoped>
.btn-dash-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1B2A6B; color: #fff; font-size: .8rem; font-weight: 600;
  padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
  transition: background .15s;
}
.btn-dash-primary:hover:not(:disabled) { background: #0e1840; }
.btn-dash-primary:disabled { opacity: .5; cursor: not-allowed; }

.btn-dash-cancel {
  background: #f4f4f5; color: #444; font-size: .8rem; font-weight: 600;
  padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
}

.btn-dash-sm {
  font-size: .72rem; font-weight: 600; padding: 5px 10px; border-radius: 6px;
  border: 1px solid #e0e0e0; background: #fff; cursor: pointer; color: #555;
  transition: all .15s;
}
.btn-dash-sm:hover { border-color: #1B2A6B; color: #1B2A6B; }
.btn-dash-sm--danger:hover { border-color: #dc2626; color: #dc2626; }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  background: #fff; border-radius: 16px; width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,.18);
}
.modal-box--wide { max-width: 720px; }
.modal-box--sm   { max-width: 380px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid #f0f0f0;
}
.modal-header h2 { font-size: 1rem; font-weight: 700; color: #1B2A6B; }
.modal-close { background: none; border: none; font-size: 1rem; color: #aaa; cursor: pointer; }
.modal-body  { padding: 20px 24px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f0f0; }

/* Form fields */
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #888; }
.field input, .field textarea, .field select {
  border: 1px solid #e0e0e0; border-radius: 8px; padding: 9px 12px;
  font-size: .85rem; font-family: inherit; outline: none; transition: border-color .15s;
}
.field input:focus, .field textarea:focus { border-color: #1B2A6B; }
.field textarea { resize: vertical; }
.field--check { justify-content: center; }
.check-label { display: flex; align-items: center; gap: 8px; font-size: .83rem; color: #555; cursor: pointer; text-transform: none; letter-spacing: 0; font-weight: 500; }
.check-label input { width: 15px; height: 15px; }

.form-error { background: #fef2f2; color: #dc2626; font-size: .78rem; padding: 10px 14px; border-radius: 8px; margin-top: 4px; }

/* Image grid */
.img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
.img-card { position: relative; border-radius: 10px; overflow: hidden; border: 1px solid #eee; aspect-ratio: 4/3; background: #f9f9f9; }
.img-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.img-card__actions {
  position: absolute; top: 6px; right: 6px; display: flex; gap: 4px;
  opacity: 0; transition: opacity .15s;
}
.img-card:hover .img-card__actions { opacity: 1; }
.img-action {
  width: 26px; height: 26px; border-radius: 50%; border: none; cursor: pointer;
  font-size: .75rem; background: rgba(255,255,255,.9); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.img-action--primary { background: #fef9c3; cursor: default; }
.img-action--del { background: #fee2e2; color: #dc2626; }

/* Upload area */
.upload-area {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px dashed #d1d5db; border-radius: 12px; padding: 32px 20px;
  cursor: pointer; transition: all .2s; text-align: center;
}
.upload-area:hover, .upload-area--over { border-color: #1B2A6B; background: rgba(27,42,107,.03); }
.upload-area__icon { font-size: 1.8rem; margin-bottom: 10px; }
.upload-area__text { font-size: .85rem; color: #555; }
.upload-area__link { color: #1B2A6B; font-weight: 600; text-decoration: underline; }
.upload-area__sub  { font-size: .72rem; color: #aaa; margin-top: 4px; }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
