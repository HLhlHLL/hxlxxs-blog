<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { ICategory } from '@/types'
import { formatCategoryTree } from '@/utils/shared'
import CatalogTree from '@/components/CatalogTree/index.vue'
import NoData from '@/components/NoData/index.vue'

const categories = ref<ICategory[]>([])

const global: any = inject('global')

const getCategories = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/categories')
  categories.value = formatCategoryTree(data.results.slice(0))
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
    <NoData v-if="categories.length === 0" text="还没有添加分类，waiting..." />
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
