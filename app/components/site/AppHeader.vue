<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileOpen = ref(false);

const closeMobile = () => {
  mobileOpen.value = false;
  if (typeof document !== "undefined") document.body.style.overflow = "";
};

const openMobile = () => {
  mobileOpen.value = true;
  if (typeof document !== "undefined") document.body.style.overflow = "hidden";
};

const isActive = (path: string) => route.path === path;

watch(
  () => route.path,
  () => closeMobile()
);

const authStore = useAuthStore();
const { logout } = useAuth();
async function handleLogout() {
  await logout();
}
</script>

<template>
  <header>
    <nav id="navbar" class="nav solid">
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
        <div class="nav-auth">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/dashboard"
              class="nav-auth-link"
              >Dashboard</NuxtLink
            >
            <NuxtLink to="/booking" class="nav-auth-link"
              >Prenotazioni</NuxtLink
            >
            <button class="nav-auth-btn" @click="handleLogout">Esci</button>
          </template>
          <NuxtLink v-else to="/login" class="nav-auth-btn">Accedi</NuxtLink>
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
      <template v-if="authStore.isAuthenticated">
        <NuxtLink v-if="authStore.isAdmin" to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink to="/booking">Prenotazioni</NuxtLink>
        <button class="mobile-logout" @click="handleLogout">Esci</button>
      </template>
      <NuxtLink v-else to="/login">Accedi</NuxtLink>
    </div>
  </header>
</template>
