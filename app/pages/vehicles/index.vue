<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <div class="sec-label mb-2">Rent Car</div>
    <h1 class="sec-title mb-3">Veicoli a noleggio</h1>
    <p class="sec-desc mb-8">Aggiungi un noleggio alla tua prenotazione di parcheggio.</p>

    <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer mb-8">
      <input v-model="availableOnly" type="checkbox" class="rounded border-gray-300" />
      Mostra solo disponibili
    </label>

    <div v-if="loading" class="text-center py-12 text-gray-400">Caricamento veicoli…</div>
    <div v-else-if="vehicles.length === 0" class="text-center py-12 text-gray-400">Nessun veicolo trovato.</div>
    <div v-else class="rent-grid">
      <VehicleVehicleCard v-for="vehicle in vehicles" :key="vehicle.id" :vehicle="vehicle" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { vehicles, loading, fetchVehicles } = useVehicles();
const availableOnly = ref(false);

watch(availableOnly, (val) => fetchVehicles(val));
onMounted(() => fetchVehicles(false));
</script>
