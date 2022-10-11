export type Nav = {
  path: string
  count: number
  text: string
}

export const navList: Nav[] = [
  {
    path: '/archives',
    count: 0,
    text: '日志'
  },
  {
    path: '/category',
    count: 0,
    text: '分类'
  },
  {
    path: '/tag',
    count: 0,
    text: '标签'
  }
]
