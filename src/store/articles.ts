import { IArticle } from '@/types'
import { defineStore } from 'pinia'

interface IArticleStoreProps {
  articleList: IArticle[]
}

export const useArticlesStore = defineStore('articles', {
  state(): IArticleStoreProps {
    return {
      articleList: []
    }
  },
  actions: {
    setArticleList(articleList: IArticle[]) {
      this.articleList = articleList
    }
  },
  persist: {
    paths: ['articleList'],
    storage: sessionStorage
  }
})
