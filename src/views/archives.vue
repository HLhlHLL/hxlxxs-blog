<script setup lang="ts">
import ArticleList from '@/components/ArticleList/index.vue'
</script>

<template>
  <div class="archives animate__animated animate__fadeIn">
    <div class="archives-title">
      <span>今夕是何年</span>
    </div>
    <ArticleList />
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
