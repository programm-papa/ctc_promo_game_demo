import './assets/main.css'
import Vue3Lottie from 'vue3-lottie'
import VueYandexMetrika from 'vue3-yandex-metrika'
// import LottieVuePlayer from '@lottiefiles/vue-lottie-player';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(Vue3Lottie);

console.log(import.meta.env.MODE)
// console.log(import.meta.env.DEV)
app.use(VueYandexMetrika, {
    id: 96780928,
    env: import.meta.env.MODE,
    options: {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    }
})

app.mount('#app')
