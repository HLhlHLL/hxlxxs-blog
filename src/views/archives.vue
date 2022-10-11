<script setup lang="ts">
import { reactive } from 'vue'
import ArticleList from '@/components/ArticleList/index.vue'

const archives = reactive({
  year: 2022,
  articles: [
    {
      title: '平凡的世界',
      meta: '10-01'
    },
    {
      title: '平凡的世界',
      meta: '10-01'
    },
    {
      title: '平凡的世界',
      meta: '10-01'
    },
    {
      title: '平凡的世界',
      meta: '10-01'
    },
    {
      title: '平凡的世界',
      meta: '10-01'
    }
  ]
})
const currentYear = archives.year

// year 对应的 articles
</script>

<template>
  <div class="archives animate__animated animate__fadeIn">
    <div class="archives-title">
      <span>今夕是何年</span>
    </div>
    <ArticleList :year="currentYear" :articles="archives.articles" />
  </div>
</template>

<style scoped lang="scss">
.archives {
  min-height: 600px;
  .archives-title {
    text-align: center;
    font-size: 40px;
  }
}
</style>
