// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'https://script.google.com/macros/s/AKfycbwKCY4mVd8LjWt6m700s7HXjDqzMwhmN6z5XZPupWzKZ3kUzamejsTpstimFeIvnZr9/exec', 
    }
  },
  devtools: { enabled: true },
  modules: [ '@nuxt/image-edge'],
  css: ["bootstrap/dist/css/bootstrap.min.css"],//追加
})
