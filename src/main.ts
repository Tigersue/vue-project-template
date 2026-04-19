import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './stores'
import { setupAuthDirective } from './plugins/auth'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './styles/index.css'

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const app = createApp(App)
  setupStore(app)
  app.use(router)
  setupAuthDirective(app)
  app.mount('#app')
}

bootstrap()
