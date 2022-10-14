import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'md-editor-v3/lib/style.css'
import 'animate.css'
import '@/style/common.css'
import '@/style/reset.css'
import '@/style/animista.css'
import http from '@/utils/request'
import message from '@/components/Message/index'
import '@/components/Message/index'
import cusPlugin from '@/plugin/index'
import pinia from './store'

const app = createApp(App)

app.provide('global', {
  $http: http,
  $message: message
})
app.use(cusPlugin)
app.use(router)
app.use(pinia)
app.mount('#app')
