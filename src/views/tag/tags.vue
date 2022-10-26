<script setup lang="ts">
import { ITag } from '@/types'
import { inject, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NoData from '@/components/NoData/index.vue'

const global: any = inject('global')

const router = useRouter()
const tags = ref<ITag[]>([])
const noData = ref<boolean>(false)

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

watch(
  () => tags,
  (newValue) => {
    newValue.value.length === 0 ? (noData.value = true) : (noData.value = false)
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="tag-set animate__animated animate__fadeIn">
    <div class="tag-set-title">
      <span>Tags</span>
    </div>
    <div class="tags">
      <span
        class="tag-item animate__animated animate__flipInY"
        v-for="tag in tags"
        :key="tag.tagName"
        @click="handleNavigateToArticle(tag)"
      >
        {{ tag.tagName }}
      </span>
    </div>
    <NoData v-if="noData" text="还没有添加标签，waiting..." />
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
      margin: 15px;
      font-size: 24px;
      color: #111;
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        color: #111;
        text-shadow: 3px 3px 4px rgba($color: #000000, $alpha: 0.2);
      }
    }
  }
}
</style>
