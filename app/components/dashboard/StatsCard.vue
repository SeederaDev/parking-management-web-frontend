<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
    :class="`border-l-4 border-l-${color}-500`"
  >
    <div class="text-4xl">{{ icon }}</div>
    <div>
      <div class="text-2xl font-bold text-gray-800">{{ value }}</div>
      <div class="text-sm text-gray-500 mt-0.5">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}>();
</script>
