import { createApp } from 'vue'
// import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
// import 'element-plus/dist/index.css'
import 'md-editor-v3/lib/style.css'
import 'animate.css'
import '@/style/common.css'
import '@/style/reset.css'
import '@/style/animista.css'
import http from '@/utils/request'
import message from '@/components/Message/index'
import '@/components/Message/index'
import cusPlugin from '@/plugin/index'

const app = createApp(App)
app.provide('global', {
  $http: http,
  $message: message
})
app.use(cusPlugin)
app.use(router)
// .use(ElementPlus)
app.mount('#app')
