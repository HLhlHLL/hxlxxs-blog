import { App } from 'vue'
import dayjs from 'dayjs'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    dateFormat: any
  }
}

export default {
  install: function (app: App) {
    app.config.globalProperties.dateFormat = dayjs
  }
}
