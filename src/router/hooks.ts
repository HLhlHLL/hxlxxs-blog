import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export default {
  'if-authorized': (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (to.name === 'newarticle') {
      const token = sessionStorage.getItem('sessionToken')
      if (!token) {
        next('/home')
      } else {
        next()
      }
    } else {
      next()
    }
  }
}
