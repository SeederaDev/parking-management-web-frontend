// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8000/api",
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_KEY ?? "",
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
});
