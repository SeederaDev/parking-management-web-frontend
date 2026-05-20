<script setup lang="ts">
useReveal();
</script>

<template>
  <div class="site-layout">
    <SiteSvgSprite />
    <SiteAppHeader />
    <main style="padding-top:72px">
      <slot />
    </main>
    <SiteAppFooter />
  </div>
</template>
