<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import CatalogTree from '@/components/CatalogTree/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { ICategory } from '@/types'

const categories = ref<ICategory[]>([])

const global: any = inject('global')
const route = useRoute()
const router = useRouter()

const getCategories = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/categories')
  categories.value = data.results
}
onMounted(() => {
  getCategories()
})
</script>

<template>
  <div class="categories animate__animated animate__fadeIn">
    <div class="article-category-title"><span>Categories</span></div>
    <div class="category-tree">
      <CatalogTree :categoryList="categories" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.categories {
  min-height: 600px;
  .article-category-title {
    text-align: center;
    font-size: 40px;
  }
  .category-tree {
    margin-top: 40px;
  }
}
</style>
