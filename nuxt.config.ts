// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', 
    public: {
      apiBase: 'https://sheets.googleapis.com/v4/spreadsheets/1A38gTrIjN2dMQ8Ktu3R__TF3-yPMYH3RAD4vZf9MUVE/values/csv', 
    }
  },
  devtools: { enabled: true },
  modules: [ '@nuxt/image-edge'],
  css: ["bootstrap/dist/css/bootstrap.min.css"],//追加
})
