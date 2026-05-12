<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group"
    :class="
      isActive
        ? 'bg-white/10 text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    "
  >
    <span class="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
      <slot name="icon" />
    </span>
    <span class="font-medium">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string;
  label: string;
  exact?: boolean;
}>();

const route = useRoute();

const isActive = computed(() =>
  props.exact ? route.path === props.to : route.path.startsWith(props.to)
);
</script>
