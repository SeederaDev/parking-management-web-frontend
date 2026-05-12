<template>
  <div class="max-w-3xl space-y-6">
    <!-- Add closure form -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-sm font-semibold text-gray-800 mb-4">
        Aggiungi periodo di chiusura
      </h2>
      <div
        v-if="formError"
        class="mb-4 bg-red-50 text-red-800 rounded-xl p-3 text-sm"
      >
        {{ formError }}
      </div>
      <form
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        @submit.prevent="submit"
      >
        <div>
          <label class="block text-xs text-gray-500 mb-1">Data inizio</label>
          <input
            v-model="form.start_date"
            type="date"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Data fine</label>
          <input
            v-model="form.end_date"
            type="date"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs text-gray-500 mb-1">Motivo</label>
          <input
            v-model="form.reason"
            type="text"
            required
            placeholder="es. Natale, manutenzione straordinaria…"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div class="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? "Salvataggio…" : "Aggiungi chiusura" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Existing closures -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-sm font-semibold text-gray-800 mb-4">
        Periodi di chiusura
      </h2>

      <div
        v-if="loading && !closures.length"
        class="text-center py-8 text-gray-400"
      >
        Caricamento…
      </div>
      <div v-else-if="!closures.length" class="text-center py-8 text-gray-400">
        Nessun periodo di chiusura configurato.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="c in closures"
          :key="c.id"
          class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-800">{{ c.reason }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ formatDate(c.start_date) }} → {{ formatDate(c.end_date) }}
            </p>
          </div>
          <button
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
            @click="remove(c.id)"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const {
  closures,
  loading,
  error,
  fetchClosures,
  createClosure,
  deleteClosure,
} = useClosures();

const formError = ref<string | null>(null);

const form = reactive({
  start_date: "",
  end_date: "",
  reason: "",
  location: null as string | null,
});

async function submit() {
  formError.value = null;
  const result = await createClosure({
    start_date: form.start_date,
    end_date: form.end_date,
    reason: form.reason,
    location: form.location,
  });
  if (result) {
    form.start_date = "";
    form.end_date = "";
    form.reason = "";
  } else {
    formError.value = error.value ?? "Errore durante il salvataggio.";
  }
}

async function remove(id: string) {
  await deleteClosure(id);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

onMounted(fetchClosures);
</script>
