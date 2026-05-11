<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Veicoli a noleggio</h1>
    <p class="text-gray-500 mb-6">
      Aggiungi un noleggio alla tua prenotazione di parcheggio.
    </p>

    <div class="flex items-center gap-3 mb-6">
      <label
        class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
      >
        <input v-model="availableOnly" type="checkbox" class="rounded" />
        Mostra solo disponibili
      </label>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">
      Caricamento veicoli…
    </div>

    <div
      v-else-if="vehicles.length === 0"
      class="text-center py-12 text-gray-400"
    >
      Nessun veicolo trovato.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <VehicleVehicleCard
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
      />
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
