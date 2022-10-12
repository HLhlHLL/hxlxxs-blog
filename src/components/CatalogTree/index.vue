<script setup lang="ts">
import { ICategory } from '@/types'
import { useRouter } from 'vue-router'

type PropsData = {
  categoryList: ICategory[]
  sub?: number
}

const router = useRouter()

const props = withDefaults(defineProps<PropsData>(), {
  sub: 0
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
          fontSize: props.sub ? '16px' : '20px',
          animationDelay: `${props.sub * 0.1}s`
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
        :sub="sub + 1"
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
      position: relative;
      left: 100px;
      opacity: 0;
      cursor: pointer;
      animation: showup 0.5s ease-out forwards;
    }
    @keyframes showup {
      from {
        left: 100px;
        opacity: 0;
      }
      to {
        left: 0;
        opacity: 1;
      }
    }
    .catalog-name:hover {
      color: #222;
      border-bottom: 1px solid #222;
    }
  }
}
</style>
