<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
    :class="
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    "
  >
    <span class="text-base leading-none">{{ icon }}</span>
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}>();

const route = useRoute();

const isActive = computed(() =>
  props.exact ? route.path === props.to : route.path.startsWith(props.to)
);
</script>
