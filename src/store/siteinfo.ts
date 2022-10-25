import { defineStore } from 'pinia'
import http from '@/utils/request'

export const useSiteInfoStore = defineStore('siteinfo', {
  state() {
    return {
      archivesCount: 0,
      categoriesCount: 0,
      tagsCount: 0,
      categories: []
    }
  },
  actions: {
    async getSiteInfo() {
      try {
        const { data: arc } = await http.get(
          '/api/1.1/classes/articles?limit=0&count=1'
        )
        const { data: cate } = await http.get('/api/1.1/classes/categories')
        const { data: tag } = await http.get(
          '/api/1.1/classes/tags?limit=0&count=1'
        )
        this.categories = cate.results
        this.archivesCount = arc.count
        this.categoriesCount = cate.results.length
        this.tagsCount = tag.count
      } catch (error) {
        console.warn((error as Error).message)
      }
    }
  }
})
