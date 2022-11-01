import { useUser } from '@/store/user'
import { Directive, DirectiveBinding } from 'vue'

export const directives: Array<{ name: string; directive: Directive }> = [
  {
    name: 'permission',
    directive(el: HTMLElement, binding: DirectiveBinding) {
      const userStore = useUser()
      const token = sessionStorage.getItem('sessionToken')
      if (token !== userStore.sessionToken) {
        el.remove()
      }
    }
  }
]
