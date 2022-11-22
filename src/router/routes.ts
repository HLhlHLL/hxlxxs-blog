import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Articles.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/About.vue')
      },
      {
        path: 'tag',
        redirect: '/tag/tags',
        component: () => import('@/views/Tag/index.vue'),
        children: [
          {
            path: 'tags',
            name: 'tag_tags',
            component: () => import('@/views/Tag/Tags.vue')
          },
          {
            path: 'articles/:tag/:tid',
            name: 'tag_articles',
            component: () => import('@/views/Tag/ArticleList.vue')
          }
        ]
      },
      {
        path: 'category',
        redirect: '/category/categories',
        component: () => import('@/views/Category/index.vue'),
        children: [
          {
            path: 'categories',
            component: () => import('@/views/Category/Categories.vue')
          },
          {
            path: 'articles/:category/:cid',
            name: 'category_articles',
            component: () => import('@/views/Category/ArticleList.vue')
          }
        ]
      },
      {
        path: 'archives',
        name: 'archives',
        component: () => import('@/views/Archives.vue')
      },
      {
        path: 'comments',
        name: 'comments',
        component: () => import('@/views/Comments.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/Search.vue')
      },
      {
        path: 'article/:aid/:objectId?',
        name: 'article',
        component: () => import('@/views/ArticleDetail.vue')
      },
      {
        path: 'newarticle/:aid?/:objectId?',
        name: 'newarticle',
        component: () => import('@/views/NewArticle.vue')
      },
      {
        path: 'manage',
        name: 'manage',
        component: () => import('@/views/Manage.vue')
      }
    ]
  }
]
