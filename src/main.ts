import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: { Notify } // 啟用 Notify，讓畫面任何地方都能呼叫 $q.notify(...) 跳出提示
})
app.use(createPinia())
app.use(router)
app.mount('#app')