<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {{ label }}
        </p>
        <p class="text-2xl font-bold text-navy-deep font-display tracking-tight">
          {{ value }}
        </p>
      </div>
      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="iconBg">
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
      blue: "bg-navy/8 text-navy",
      green: "bg-emerald-50 text-emerald-600",
      yellow: "bg-amber-50 text-amber-600",
      red: "bg-brand-red/8 text-brand-red",
    }[props.color ?? "blue"] ?? "bg-navy/8 text-navy")
);
</script>
