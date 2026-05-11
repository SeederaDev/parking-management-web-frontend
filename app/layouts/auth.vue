<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-5xl">🅿</span>
        <h1 class="text-3xl font-bold text-indigo-600 mt-2">ParkManager</h1>
        <p class="text-gray-500 mt-1">Gestione parcheggi multi-tenant</p>
      </div>
      <slot />
    </div>
  </div>
</template>
