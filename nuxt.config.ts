// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '', 
    }
  },
  devtools: { enabled: true },
  modules: [ '@nuxt/image-edge'],
  css: ["bootstrap/dist/css/bootstrap.min.css"],//追加
})
