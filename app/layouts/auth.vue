<template>
  <div class="site-layout">
    <SiteSvgSprite />
    <SiteAppHeader />
    <main class="flex items-center justify-center py-20 px-4" style="min-height: calc(100vh - 72px)">
      <div class="w-full max-w-sm">
        <slot />
      </div>
    </main>
    <SiteAppFooter />
  </div>
</template>
