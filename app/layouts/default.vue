<script setup lang="ts">
useReveal();
</script>

<template>
  <div class="site-layout">
    <SiteSvgSprite />
    <SiteAppHeader />
    <main>
      <slot />
    </main>
    <SiteAppFooter />
  </div>
</template>
