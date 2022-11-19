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
  },
  {
    name: 'rotation',
    directive(el: HTMLElement, binding: DirectiveBinding) {
      const mv = 400
      el.addEventListener('mousemove', (e: MouseEvent) => {
        e.stopPropagation()
        let { offsetX: x, offsetY: y } = e
        let { offsetWidth: width, offsetHeight: height } = el
        x = x - width / 2
        y = y - height / 2
        const changeX = x / mv
        const changeY = y / mv
        el.style.transform = `perspective(400px) rotateX(${changeX}deg) rotateY(${changeY}deg) scale(1.1)`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform =
          'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1.1)'
      })
    }
  }
]
