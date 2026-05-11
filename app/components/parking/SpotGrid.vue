<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
  >
    <ParkingSpotCard
      v-for="spot in spots"
      :key="spot.id"
      :spot="spot"
      @click="$emit('select', spot)"
    />
    <div
      v-if="spots.length === 0"
      class="col-span-full text-center py-8 text-gray-400"
    >
      Nessun posto disponibile per il periodo selezionato.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParkingSpot } from "~/stores/parking";

defineProps<{ spots: ParkingSpot[] }>();
defineEmits<{ select: [spot: ParkingSpot] }>();
</script>
