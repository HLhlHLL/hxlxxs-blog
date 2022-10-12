<script setup lang="ts">
import { reactive, onBeforeMount, ref, inject } from 'vue'
import Article from '@/components/Article/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { IArticle } from '@/types'
import { useArticlesStore } from '@/store/articles'

const global: any = inject('global')
const articleList = ref<IArticle[]>([])
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
}

const getArticleList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/articles')
  articleList.value = data.results.sort((pre: any, next: any) => {
    return (
      new Date(next.createdAt).getTime() - new Date(pre.createdAt).getTime()
    )
  })
  pagination.total = articleList.value.length
  articleStore.setArticleList(articleList.value)
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
      v-if="articleList.length > 5"
      :pagination="pagination"
      @get-current-page="handleGetCurrentPage"
    />
  </div>
</template>

<style scoped lang="scss"></style>
