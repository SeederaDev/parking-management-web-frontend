<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <!-- Image -->
    <div
      class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden"
    >
      <img
        v-if="primaryImage"
        :src="primaryImage"
        :alt="`${vehicle.name} ${vehicle.model}`"
        class="w-full h-full object-cover"
      />
      <span v-else class="text-5xl">🚗</span>
    </div>

    <!-- Info -->
    <div class="p-5">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="font-bold text-gray-800">
            {{ vehicle.name }} {{ vehicle.model }}
          </h3>
          <p class="text-gray-500 text-sm mt-0.5 line-clamp-2">
            {{ vehicle.description }}
          </p>
        </div>
        <span
          :class="
            vehicle.is_available
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          "
          class="shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
        >
          {{ vehicle.is_available ? "Disponibile" : "Non disponibile" }}
        </span>
      </div>

      <div class="text-indigo-600 font-bold text-lg mt-3">
        €{{ vehicle.price_per_day }}
        <span class="text-gray-400 font-normal text-sm">/ giorno</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from "~/composables/useVehicles";

const props = defineProps<{ vehicle: Vehicle }>();

const primaryImage = computed(
  () =>
    props.vehicle.images.find((i) => i.is_primary)?.image ??
    props.vehicle.images[0]?.image ??
    null
);
</script>
