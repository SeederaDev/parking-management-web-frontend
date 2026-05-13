<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileOpen = ref(false);
const solidNav = ref(false);
const isHome = computed(() => route.path === "/");
let removeScrollListener: (() => void) | null = null;

const closeMobile = () => {
  mobileOpen.value = false;
  if (typeof document !== "undefined") document.body.style.overflow = "";
};

const openMobile = () => {
  mobileOpen.value = true;
  if (typeof document !== "undefined") document.body.style.overflow = "hidden";
};

const isActive = (path: string) => route.path === path;

onMounted(() => {
  const onScroll = () => {
    solidNav.value = window.scrollY > 40;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  removeScrollListener = () => window.removeEventListener("scroll", onScroll);
});

onBeforeUnmount(() => removeScrollListener?.());

watch(
  () => route.path,
  () => closeMobile()
);
</script>

<template>
  <header>
    <nav id="navbar" class="nav" :class="{ solid: solidNav || !isHome }">
      <div class="nav-inner">
        <NuxtLink
          to="/"
          class="nav-logo"
          aria-label="Palmieri &amp; Treglia Home"
        >
          <img
            src="/logo.avif"
            alt="Palmieri &amp; Treglia"
            class="brand-logo"
          />
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink
            v-for="page in sitePages"
            :key="page.path"
            :to="page.path"
            :class="[
              { active: isActive(page.path) },
              page.cta ? 'nav-cta-btn' : '',
            ]"
          >
            {{ page.label }}
          </NuxtLink>
        </div>
        <button
          class="hamburger"
          type="button"
          aria-label="Menu"
          @click="openMobile"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>

    <div class="mobile-menu" :class="{ open: mobileOpen }">
      <button
        class="mobile-close"
        type="button"
        aria-label="Chiudi menu"
        @click="closeMobile"
      >
        &times;
      </button>
      <NuxtLink v-for="page in sitePages" :key="page.path" :to="page.path">{{
        page.label
      }}</NuxtLink>
    </div>
  </header>
</template>
