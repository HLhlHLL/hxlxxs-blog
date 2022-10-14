import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { routes } from './routes'
import hooks from './hooks'

const vh = window.innerHeight

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (from.name !== undefined) {
      return {
        top: vh,
        behavior: 'smooth'
      }
    }
  }
})

Object.values(hooks).forEach((hook) => {
  router.beforeEach(hook)
})

export default router
