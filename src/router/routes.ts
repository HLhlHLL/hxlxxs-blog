import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about.vue')
      },
      {
        path: 'tag',
        redirect: '/tag/tags',
        component: () => import('@/views/tag/index.vue'),
        children: [
          {
            path: 'tags',
            name: 'tag_tags',
            component: () => import('@/views/tag/tags.vue')
          },
          {
            path: 'articles/:tag/:tid',
            name: 'tag_articles',
            component: () => import('@/views/tag/articlelist.vue')
          }
        ]
      },
      {
        path: 'category',
        redirect: '/category/categories',
        component: () => import('@/views/category/index.vue'),
        children: [
          {
            path: 'categories',
            component: () => import('@/views/category/categories.vue')
          },
          {
            path: 'articles/:category/:cid',
            name: 'category_articles',
            component: () => import('@/views/category/articlelist.vue')
          }
        ]
      },
      {
        path: 'archives',
        name: 'archives',
        component: () => import('@/views/archives.vue')
      },
      {
        path: 'comments',
        name: 'comments',
        component: () => import('@/views/comments.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/search.vue')
      },
      {
        path: 'article/:aid/:index/:objectId?',
        name: 'article',
        component: () => import('@/views/article.vue')
      },
      {
        path: 'newarticle/:aid?/:objectId?',
        name: 'newarticle',
        component: () => import('@/views/newarticle.vue')
      },
      {
        path: 'manage',
        name: 'manage',
        component: () => import('@/views/manage.vue')
      }
    ]
  }
]
