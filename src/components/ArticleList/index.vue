<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IArticle } from '@/types'
import Pagination from '@/components/Pagination/index.vue'
import { useArticlesStore } from '@/store/articles'

type PropsData = {
  payload?: string
}

const route = useRoute()
const router = useRouter()
const articleStore = useArticlesStore()
const props = defineProps<PropsData>()
const global: any = inject('global')
const currentYear = ref<number>(new Date().getFullYear())
const articles = ref<IArticle[]>([])
const detail = reactive({
  label:
    (route.params.tag as string) || (route.params.category as string) || '',
  tid: route.params.tid as string,
  cid: route.params.cid as string
})

const pagination = reactive({
  total: 0,
  size: 5,
  range: 3,
  currentPage: 1
})
const handleGetCurrentPage = (page: number) => {
  pagination.currentPage = page
  getArticleList()
}
const handleNavigateToArticle = (article: IArticle) => {
  const index = articleStore.articleList.findIndex((a) => a.aid === article.aid)
  router.push({
    name: 'article',
    params: {
      aid: article.aid,
      index
    }
  })
}

const handlePreviousYear = () => {
  currentYear.value -= 1
  getArticleList()
}
const handleNextYear = () => {
  currentYear.value += 1
  getArticleList()
}

const getArticleCount = async () => {
  if (detail.tid) {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"$and":[{"tid": "${
        detail.tid
      }"},{"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}]}&limit=0&count=1`
    )
    pagination.total = data.count
  } else if (detail.cid) {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"$and":[{"cid": "${
        detail.cid
      }"},{"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}]}&limit=0&count=1`
    )
    pagination.total = data.count
  } else {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}&limit=0&count=1`
    )
    pagination.total = data.count
  }
}

// 请求分页数据
const getArticleList = async () => {
  const skip =
    pagination.currentPage > 1
      ? (pagination.currentPage - 1) * pagination.size
      : 0
  if (detail.tid) {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"$and":[{"tid": "${
        detail.tid
      }"},{"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}]}&limit=${pagination.size}&skip=${skip}`
    )
    articles.value = data.results
  } else if (detail.cid) {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"$and":[{"cid": "${
        detail.cid
      }"},{"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}]}&limit=${pagination.size}&skip=${skip}`
    )
    articles.value = data.results
  } else {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}&limit=${pagination.size}&skip=${skip}`
    )
    articles.value = data.results
  }
}

onMounted(() => {
  getArticleList()
  getArticleCount()
})
</script>

<template>
  <div class="article-list">
    <div class="article-list-content">
      <div class="payload" v-if="props.payload">
        <span>{{ props.payload }}</span>
        <span class="category-name" v-if="detail.label">{{
          detail.label
        }}</span>
      </div>
      <div class="year">
        <span
          class="current-year"
          :style="{
            fontSize: props.payload ? '24px' : '30px'
          }"
          >{{ currentYear }}</span
        >
        <div class="year-selector">
          <i class="iconfont icon-previous" @click="handlePreviousYear"></i>
          <i class="iconfont icon-next" @click="handleNextYear"></i>
        </div>
      </div>
      <div
        class="list-item"
        :style="{
          animationDelay: `${index * 0.1}s`
        }"
        v-for="(article, index) in articles"
        :key="article.aid"
        @click="handleNavigateToArticle(article)"
      >
        <div class="item-content">
          <div class="item-meta">
            {{ dateFormat(article.createdAt).format('MM-DD') }}
          </div>
          <div class="item-title">{{ article.title }}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <Pagination
        button-color="#222"
        v-if="pagination.total > 5"
        :pagination="pagination"
        @getCurrentPage="handleGetCurrentPage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-list {
  .article-list-content {
    position: relative;
    margin: 40px 0 60px 0;
    padding-bottom: 15px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: #f5f5f5;
    }
    .payload {
      font-size: 30px;
      padding-left: 20px;
      margin-bottom: 10px;

      .category-name {
        margin-left: 20px;
        font-size: 20px;
        color: #999;
      }
    }
    .year {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 30px;
      padding-left: 20px;
      .current-year {
        cursor: default;
      }
      .year-selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 20px;
        .iconfont {
          cursor: pointer;
          &:hover {
            color: #999;
          }
        }
      }
    }
    .list-item {
      position: relative;
      left: 100px;
      margin-top: 20px;
      padding-left: 20px;
      border-bottom: 1px dashed #ccc;
      line-height: 2;
      opacity: 0;
      cursor: pointer;
      animation: showup 0.5s ease-out forwards;
      .item-meta {
        font-size: 14px;
        color: #999;
        vertical-align: bottom;
      }
      &:hover {
        border-color: #555;
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -1px;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background-color: #bbb;
        border-radius: 50%;
        transition: all 0.3s linear;
      }
      &:hover::before {
        background-color: #555;
      }
    }

    @keyframes showup {
      from {
        left: 100px;
        opacity: 0;
      }
      to {
        left: -1px;
        opacity: 1;
      }
    }
  }
}
</style>
