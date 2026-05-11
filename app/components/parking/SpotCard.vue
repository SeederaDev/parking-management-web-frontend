<template>
  <button
    class="rounded-xl border-2 p-4 text-center transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    :class="cardClass"
    @click="$emit('click', spot)"
  >
    <div class="text-2xl mb-1">{{ typeIcon }}</div>
    <div class="font-bold text-gray-800">{{ spot.identifier }}</div>
    <div class="text-xs text-gray-500 mt-0.5 capitalize">
      {{ spot.spot_type }}
    </div>
  </button>
</template>

<script setup lang="ts">
import type { ParkingSpot } from "~/stores/parking";

const props = defineProps<{ spot: ParkingSpot }>();
defineEmits<{ click: [spot: ParkingSpot] }>();

const typeIcon: Record<string, string> = {
  standard: "🔵",
  disabled: "♿",
  ev: "⚡",
  vip: "⭐",
};

const cardClass = computed(() => ({
  "border-green-400 bg-green-50 hover:bg-green-100 cursor-pointer":
    props.spot.status === "free",
  "border-red-300 bg-red-50 opacity-60 cursor-not-allowed":
    props.spot.status === "occupied",
  "border-yellow-400 bg-yellow-50 opacity-70 cursor-not-allowed":
    props.spot.status === "reserved",
}));
</script>
