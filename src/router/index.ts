import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { routes } from './routes'
import hooks from './hooks'

const router = createRouter({
  history: createWebHistory('/blog'),
  routes
})

Object.values(hooks).forEach((hook) => {
  router.beforeEach(hook)
})

export default router
