import { createApp } from 'vue'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}
})
app.use(createPinia())
app.use(router)
app.mount('#app')