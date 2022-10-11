import { h, render } from 'vue'
import Message from './Message.vue'

type MessageOption = {
  message: string
  type: string
}

export default function ({ message, type }: MessageOption) {
  const vnode = h(Message, {
    message,
    type,
    destroyFn() {
      render(null, document.body)
    }
  })
  render(vnode, document.body)
}
