import { createPersistedState } from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  // Register pinia-plugin-persistedstate with the Pinia instance
  // provided by @pinia/nuxt.
  const pinia = nuxtApp.$pinia as ReturnType<
    typeof import("pinia").createPinia
  >;
  pinia.use(createPersistedState());
});
