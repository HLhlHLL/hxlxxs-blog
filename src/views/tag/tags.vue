<script setup lang="ts">
import { ITag } from '@/types'
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NoData from '@/components/NoData/index.vue'

const global: any = inject('global')

const router = useRouter()
const tags = ref<ITag[]>([])

const handleNavigateToArticle = (tag: ITag) => {
  router.push({
    name: 'tag_articles',
    params: {
      tag: tag.tagName,
      tid: tag.tid
    }
  })
}

const getTags = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/tags')
  tags.value = data.results
}

onMounted(() => {
  getTags()
})
</script>

<template>
  <div class="tag-set animate__animated animate__fadeIn">
    <div class="tag-set-title">
      <span>Tags</span>
    </div>
    <div class="tags">
      <span
        class="tag-item"
        v-for="tag in tags"
        :key="tag.tagName"
        :style="{
          fontSize: `${Math.random() * 16 + 16}px`
        }"
        @click="handleNavigateToArticle(tag)"
      >
        {{ tag.tagName }}
      </span>
    </div>
    <NoData v-if="tags.length === 0" text="还没有添加标签，waiting..." />
  </div>
</template>

<style scoped lang="scss">
.tag-set {
  min-height: 650px;
  .tag-set-title {
    font-size: 40px;
    text-align: center;
  }
  .tags {
    margin-top: 40px;
    .tag-item {
      display: inline-block;
      color: #111;
      margin: 15px;
      transition: all 0.1s linear;
      cursor: pointer;
      animation: showup 0.5s linear;
      &:hover {
        color: #111;
        text-shadow: 3px 3px 4px rgba($color: #000000, $alpha: 0.2);
      }
    }
    @keyframes showup {
      from {
        transform: scale(0) rotate(0);
        opacity: 0;
      }
      to {
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
  }
}
</style>
