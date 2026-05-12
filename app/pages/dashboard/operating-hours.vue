<template>
  <div class="max-w-3xl">
    <div v-if="loading" class="text-center py-16 text-gray-400">
      Caricamento…
    </div>
    <div
      v-else-if="error"
      class="bg-red-50 text-red-800 rounded-xl p-4 text-sm mb-4"
    >
      {{ error }}
    </div>

    <div
      v-else
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
      >
        <h2 class="text-sm font-semibold text-gray-800">
          Orari di apertura settimanali
        </h2>
        <p class="text-xs text-gray-500">
          Le modifiche si applicano immediatamente
        </p>
      </div>

      <div class="divide-y divide-gray-50">
        <div
          v-for="row in hoursGrid"
          :key="row.day"
          class="flex items-center gap-4 px-6 py-4"
        >
          <div class="w-28 text-sm font-medium text-gray-700">
            {{ dayNames[row.day] }}
          </div>

          <label class="flex items-center gap-2 text-sm text-gray-600 w-20">
            <input
              v-model="row.is_open"
              type="checkbox"
              class="rounded text-indigo-600"
              @change="saveRow(row)"
            />
            Aperto
          </label>

          <div v-if="row.is_open" class="flex items-center gap-2 flex-1">
            <input
              v-model="row.open_time"
              type="time"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              @blur="saveRow(row)"
            />
            <span class="text-gray-400">→</span>
            <input
              v-model="row.close_time"
              type="time"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              @blur="saveRow(row)"
            />
          </div>
          <div v-else class="text-sm text-gray-400 flex-1">Chiuso</div>

          <span v-if="row.saving" class="text-xs text-gray-400"
            >Salvataggio…</span
          >
          <span v-if="row.saved" class="text-xs text-green-600">✓ Salvato</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DayOfWeek } from "~/types";

definePageMeta({ layout: "dashboard", middleware: ["auth", "admin"] });

const { hours, loading, error, fetchHours, createHours, updateHours } =
  useOperatingHours();

const dayNames: Record<number, string> = {
  0: "Lunedì",
  1: "Martedì",
  2: "Mercoledì",
  3: "Giovedì",
  4: "Venerdì",
  5: "Sabato",
  6: "Domenica",
};

interface GridRow {
  day: DayOfWeek;
  id: string | null;
  is_open: boolean;
  open_time: string;
  close_time: string;
  saving: boolean;
  saved: boolean;
}

const hoursGrid = ref<GridRow[]>([]);

function buildGrid() {
  const grid: GridRow[] = [];
  for (let d = 0; d <= 6; d++) {
    const existing = hours.value.find((h) => h.day_of_week === d);
    grid.push({
      day: d as DayOfWeek,
      id: existing?.id ?? null,
      is_open: existing?.is_open ?? false,
      open_time: existing?.open_time ?? "08:00",
      close_time: existing?.close_time ?? "20:00",
      saving: false,
      saved: false,
    });
  }
  hoursGrid.value = grid;
}

async function saveRow(row: GridRow) {
  row.saving = true;
  row.saved = false;
  const payload = {
    day_of_week: row.day,
    is_open: row.is_open,
    open_time: row.is_open ? row.open_time : null,
    close_time: row.is_open ? row.close_time : null,
    location: null,
  };

  let result;
  if (row.id) {
    result = await updateHours(row.id, payload);
  } else {
    result = await createHours(payload);
    if (result) row.id = result.id;
  }

  row.saving = false;
  if (result) {
    row.saved = true;
    setTimeout(() => {
      row.saved = false;
    }, 2000);
  }
}

onMounted(async () => {
  await fetchHours();
  buildGrid();
});
</script>
