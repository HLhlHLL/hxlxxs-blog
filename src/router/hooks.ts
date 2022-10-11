import {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {pathList} from '@/components/Navigation/data'

export default {
  'if-route-active': (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 判断将要访问路径是否在导航中，不在则取消导航选定状态
    // if(!pathList.some(path => to.path.includes(path.pathName))) {
    //   pathList.forEach(path => path.active = false)
    // }
    next()
  }
}
