export type Path = {
  pathName: string
  text: string
  pathCount?: number
}

export const pathList: Path[] = [
  {
    pathName: '/archives',
    text: '日志'
  },
  {
    pathName: '/tag',
    text: '标签'
  },
  {
    pathName: '/category',
    text: '分类'
  }
]
