<script setup lang="ts">
import { reactive, onBeforeMount, ref, inject, watch } from 'vue'
import { IArticle } from '@/types'
import { useSiteInfoStore } from '@/store/siteinfo'
import Pagination from '@/components/Pagination/index.vue'
import Article from '@/components/Article/index.vue'
import NoData from '@/components/NoData/index.vue'

const global: any = inject('global')
const articleList = ref<IArticle[]>([])
const pagination = reactive({
  total: 0,
  size: 5,
  range: 3,
  currentPage: 1
})
const loading = ref<boolean>(true)
const siteInfoStore = useSiteInfoStore()
const noData = ref<boolean>(false)

const handleGetCurrentPage = (page: number) => {
  pagination.currentPage = page
  getArticleList()
}

const getArticleList = async () => {
  const skip =
    pagination.currentPage > 1
      ? (pagination.currentPage - 1) * pagination.size
      : 0
  const { data: data1 } = await global.$http.get(
    `/api/1.1/classes/articles?&order=-createdAt&limit=${pagination.size}&skip=${skip}`
  )
  articleList.value = data1.results
  const { data: data2 } = await global.$http.get(
    '/api/1.1/classes/articles?limit=0&count=1'
  )
  pagination.total = data2.count
  loading.value = false
}

onBeforeMount(() => {
  getArticleList()
  pagination.total = siteInfoStore.archivesCount
})

watch(
  () => articleList,
  (newValue) => {
    newValue.value.length === 0 ? (noData.value = true) : (noData.value = false)
  },
  {
    deep: true
  }
)
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
    <NoData v-if="noData" text="这个人很懒，还什么都没写哦。。。" />
    <Pagination
      button-color="#222"
      v-if="pagination.total > 5"
      :pagination="pagination"
      @get-current-page="handleGetCurrentPage"
    />
  </div>
</template>

<style scoped lang="scss"></style>
