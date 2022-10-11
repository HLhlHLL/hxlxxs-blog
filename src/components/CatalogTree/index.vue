<script setup lang="ts">
import { ICategory } from '@/types'
import { useRouter } from 'vue-router'

type PropsData = {
  categoryList: ICategory[]
  sub?: boolean
}

const router = useRouter()

const props = withDefaults(defineProps<PropsData>(), {
  sub: false
})

const handleNavigateToArticleList = (category: ICategory) => {
  router.push({
    name: 'category_articles',
    params: {
      category: category.categoryName,
      cid: category.cid
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'CatalogTree'
}
</script>

<template>
  <div class="catalog-tree">
    <div
      class="catalog"
      v-for="category in props.categoryList"
      :key="category.categoryName"
    >
      <span
        class="catalog-name"
        ref="catalogNameRef"
        :style="{
          fontSize: props.sub ? '16px' : '20px'
        }"
        @click="handleNavigateToArticleList(category)"
      >
        <i
          :class="['iconfont', props.sub ? 'icon-catalog-sub' : 'icon-catalog']"
        ></i>
        {{ category.categoryName }}
      </span>
      <CatalogTree
        v-if="category.subCategory"
        :categoryList="category.subCategory"
        :sub="true"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog-tree {
  padding-left: 30px;
  .catalog {
    line-height: 2;
    .catalog-name {
      cursor: pointer;
    }
    .catalog-name:hover {
      color: #222;
      border-bottom: 1px solid #222;
    }
  }
}
</style>
