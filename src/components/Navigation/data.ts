import {reactive} from 'vue'

export type NavPath = {
  pathName: string,
  text: string,
  pathIcon: string,
  active: boolean
}

export const pathList = reactive<NavPath[]>([
  {
    pathName: '/home',
    text: '首页',
    pathIcon: 'home',
    active: true
  },
  {
    pathName: '/about',
    text: '关于',
    pathIcon: 'user',
    active: false
  },
  {
    pathName: '/tag',
    text: '标签',
    pathIcon: 'tags',
    active: false
  },
  {
    pathName: '/category',
    text: '分类',
    pathIcon: 'grid',
    active: false
  },
  {
    pathName: '/archives',
    text: '归档',
    pathIcon: 'archive',
    active: false
  },
  {
    pathName: '/comments',
    text: '留言',
    pathIcon: 'book',
    active: false
  },
  {
    pathName: '/search',
    text: '搜索',
    pathIcon: 'search',
    active: false
  },
])