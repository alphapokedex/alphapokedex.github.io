import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { toastService } from './services/toastService'

const app = createApp(App)

// Initialize toast service
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

// Initialize toast service
toastService.initialize()

app.mount('#app')
