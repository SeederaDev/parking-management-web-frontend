<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group border-l-2"
    :class="
      isActive
        ? 'bg-white/10 text-white border-brand-red'
        : 'text-white/50 border-transparent hover:bg-white/5 hover:text-white/80'
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
