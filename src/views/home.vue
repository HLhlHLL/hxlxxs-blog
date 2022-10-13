<script setup lang="ts">
import { reactive, onBeforeMount, ref, inject } from 'vue'
import Article from '@/components/Article/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { IArticle } from '@/types'
import { useArticlesStore } from '@/store/articles'

const global: any = inject('global')
const articleList = ref<IArticle[]>([])
let res: any[]
const pagination = reactive({
  total: 0,
  size: 5,
  range: 3,
  currentPage: 1
})
const loading = ref<boolean>(true)
const articleStore = useArticlesStore()

const handleGetCurrentPage = (page: number) => {
  pagination.currentPage = page
  if (page === 1) {
    articleList.value = res.slice(0, pagination.size)
  } else {
    articleList.value = res.slice(
      (pagination.currentPage - 1) * pagination.size + 1,
      pagination.currentPage * pagination.size + 1
    )
  }
}

const getArticleList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/articles')
  res = data.results.sort((pre: any, next: any) => {
    return (
      new Date(next.createdAt).getTime() - new Date(pre.createdAt).getTime()
    )
  })
  articleList.value = res.slice(0, pagination.size)
  pagination.total = res.length
  articleStore.setArticleList(res)
  loading.value = false
}

onBeforeMount(() => {
  getArticleList()
})
</script>

<template>
  <div class="article-list animate__animated animate__fadeIn">
    <Article
      overview
      v-for="(article, index) in articleList"
      :loading="loading"
      :article="article"
      :key="article.aid"
      :index="index"
    />
    <Pagination
      button-color="#222"
      v-if="pagination.total > 5"
      :pagination="pagination"
      @get-current-page="handleGetCurrentPage"
    />
  </div>
</template>

<style scoped lang="scss"></style>
