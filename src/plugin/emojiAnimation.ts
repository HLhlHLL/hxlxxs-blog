export default class Emoji {
  x: number
  y: number
  dx: number
  dy: number
  duration: number
  el: HTMLElement | null
  opacity: number
  emojis: string[]
  constructor(x: number, y: number, dx: number, dy: number, duration: number) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.duration = duration
    this.el = null
    this.opacity = 1
    this.emojis = [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😘',
      '🥰',
      '😆',
      '😉',
      '😜',
      '🤑',
      '🤡',
      '🤖',
      '🤪',
      '😳',
      '😎',
      '😴',
      '😭',
      '😩',
      '🤯',
      '😬',
      '😱',
      '😇',
      '🤭',
      '👺',
      '👹',
      '🤖',
      '👻',
      '👽',
      '💩'
    ]
    this.create()
  }

  create() {
    const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)]
    this.el = document.createElement('b')
    this.el.className = 'emoji'
    this.el.innerText = emoji
    this.el.style.left = this.x + 'px'
    this.el.style.top = this.y + 'px'
    document.body.appendChild(this.el)
  }

  render() {
    if (this.duration >= 0) {
      requestAnimationFrame(this.render.bind(this))
      this.el!.style.left = `${this.x}px`
      this.el!.style.top = `${this.y}px`
      this.el!.style.opacity = this.opacity + ''
      this.opacity -= 0.1
      this.x += this.dx
      this.y += this.dy
      this.duration -= 0.1
    } else {
      document.body.removeChild(this.el as HTMLElement)
    }
  }
}
