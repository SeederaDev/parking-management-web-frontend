<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
        >
          {{ label }}
        </p>
        <p class="text-2xl font-bold text-gray-900 tracking-tight">
          {{ value }}
        </p>
      </div>
      <div
        class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        :class="iconBg"
      >
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string | number;
  color?: string;
}>();

const iconBg = computed(
  () =>
    ({
      blue: "bg-blue-50 text-blue-600",
      green: "bg-emerald-50 text-emerald-600",
      yellow: "bg-amber-50 text-amber-600",
      red: "bg-red-50 text-red-500",
    }[props.color ?? "blue"] ?? "bg-blue-50 text-blue-600")
);
</script>
