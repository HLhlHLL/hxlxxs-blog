class Particle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  // minSize: number
  // maxSize: number
  cvsEl: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  constructor(
    x: number,
    y: number,
    dx: number,
    dy: number,
    size: number,
    cvsEl: HTMLCanvasElement
  ) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.size = size
    // this.minSize = size
    // this.maxSize = 30
    this.cvsEl = cvsEl
    this.cvsEl.width = window.innerWidth
    this.cvsEl.height = window.innerHeight
    this.ctx = this.cvsEl.getContext('2d') as CanvasRenderingContext2D
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    const radial = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    )
    radial.addColorStop(0, 'rgba(240, 180, 40, 0.3)')
    radial.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.ctx.fillStyle = radial
    this.ctx.fill()
  }

  update() {
    if (this.x + this.size > this.cvsEl.width || this.x - this.size < 0) {
      this.dx = -this.dx
    }
    if (this.y + this.size > this.cvsEl.height || this.y - this.size < 0) {
      this.dy = -this.dy
    }
    this.x += this.dx
    this.y += this.dy

    // if (
    //   mouse.x - this.x < 50 &&
    //   mouse.x - this.x > -50 &&
    //   mouse.y - this.y < 50 &&
    //   mouse.y - this.y > -50
    // ) {
    //   if (this.size < this.maxSize) {
    //     this.size++
    //   }
    // } else {
    //   if (this.size > this.minSize) {
    //     this.size--
    //   }
    // }
    this.draw()
  }
}

let particleArray: Particle[]
// const mouse = {
//   x: -999,
//   y: -999
// }

const initParticle = (cvsEl: HTMLCanvasElement) => {
  particleArray = []
  for (let i = 0; i < 200; i++) {
    const r = Math.random() * 9 + 1
    const x = Math.random() * (cvsEl.width - 2 * r) + r
    const y = Math.random() * (cvsEl.height - 2 * r) + r
    const dx = (Math.random() - 0.5) * 1.5
    const dy = (Math.random() - 0.5) * 1.5

    const particle = new Particle(x, y, dx, dy, r, cvsEl)
    particleArray.push(particle)
  }
}

// document.addEventListener('mousemove', (e: MouseEvent) => {
//   const { offsetX: x, offsetY: y } = e
//   mouse.x = x
//   mouse.y = y
// })
// document.addEventListener('mouseleave', () => {
//   mouse.x = -999
//   mouse.y = -999
// })
let requestId: number
export default (cvsEl: HTMLCanvasElement) => {
  const ctx = cvsEl.getContext('2d') as CanvasRenderingContext2D
  ctx.clearRect(0, 0, cvsEl.width, cvsEl.height)
  initParticle(cvsEl)
  if (requestId) {
    cancelAnimationFrame(requestId)
  }
  const render = () => {
    requestId = requestAnimationFrame(render)
    ctx.clearRect(0, 0, cvsEl.width, cvsEl.height)
    for (const particle of particleArray) {
      particle.update()
    }
  }
  render()
}
