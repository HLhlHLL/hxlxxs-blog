import { App } from 'vue'
import { directives } from './directives'

export default function initDirectives(app: App) {
  directives.forEach((d) => {
    app.directive(d.name, d.directive)
  })
}
