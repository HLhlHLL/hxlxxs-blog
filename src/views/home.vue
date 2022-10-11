<script setup lang="ts">
import { reactive, onMounted, inject, ref } from 'vue'
import Article from '@/components/Article/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { IArticle } from '@/types'

const global: any = inject('global')

const articleList = ref<IArticle[]>([])
const pagination = reactive({
  total: 0,
  size: 5,
  range: 3,
  currentPage: 1
})
const loading = ref<boolean>(true)
const handleGetCurrentPage = (page: number) => {
  pagination.currentPage = page
}

const getArticleList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/articles')
  articleList.value = data.results
  pagination.total = data.results.length
  loading.value = false
}
onMounted(() => {
  getArticleList()
})
</script>

<template>
  <div class="article-list animate__animated animate__fadeIn">
    <Article
      overview
      :loading="loading"
      :article="article"
      v-for="article in articleList"
      :key="article.aid"
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
