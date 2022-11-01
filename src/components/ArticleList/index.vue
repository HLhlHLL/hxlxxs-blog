<script setup lang="ts">
import { inject, watch, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IArticle } from '@/types'
import Pagination from '@/components/Pagination/index.vue'
import MessageBox from '../MessageBox/index.vue'
import NoData from '@/components/NoData/index.vue'
import { useSiteInfoStore } from '@/store/siteinfo'

type PropsData = {
  payload?: string
}

const route = useRoute()
const router = useRouter()
const siteInfoStore = useSiteInfoStore()
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
const showPage = ref<boolean>(false)
const noData = ref<boolean>(false)

const toRemoveArticle = ref<IArticle>()
const showMessageBox = ref<boolean>(false)

const handleEditArticle = (article: IArticle) => {
  router.push({
    name: 'newarticle',
    params: {
      aid: article.aid,
      objectId: article.objectId
    }
  })
}

const handleRemoveArticle = (article: IArticle) => {
  showMessageBox.value = true
  toRemoveArticle.value = article
}
const handleRemoveTagOrCategory = () => {
  showMessageBox.value = true
}
const handleCancel = () => {
  global.$message({
    message: '取消了删除操作',
    type: 'info'
  })
}
const handleConfirm = async () => {
  if (articles.value.length > 0) {
    try {
      await global.$http.delete(
        `/api/1.1/classes/articles/${toRemoveArticle.value!.objectId}`
      )
      const { data } = await global.$http.get(
        `/api/1.1/classes/contentArticle?where={"aid": "${
          toRemoveArticle.value!.aid
        }"}`
      )
      const contentArticle = data.results[0]
      await global.$http.delete(
        `/api/1.1/classes/contentArticle/${contentArticle.objectId}`
      )
      getArticleList()
      getArticleCount()
      global.$message({
        message: '删除成功！！',
        type: 'success'
      })
    } catch (error) {
      global.$message({
        message: '删除失败！！',
        type: 'danger'
      })
    }
  } else {
    try {
      if (detail.cid) {
        const { data } = await global.$http.get(
          `/api/1.1/classes/categories?where={"cid": "${detail.cid}"}`
        )
        const oId = data.results[0].objectId
        await global.$http.delete(`/api/1.1/classes/categories/${oId}`)
        global.$message({
          message: '删除成功！！',
          type: 'success'
        })
        router.go(-1)
      } else if (detail.tid) {
        const { data } = await global.$http.get(
          `/api/1.1/classes/tags?where={"tid": "${detail.tid}"}`
        )
        const oId = data.results[0].objectId
        await global.$http.delete(`/api/1.1/classes/tags/${oId}`)
        global.$message({
          message: '删除成功！！',
          type: 'success'
        })
        router.go(-1)
      }
    } catch (error) {
      global.$message({
        message: '删除失败！！',
        type: 'danger'
      })
    }
  }
}

const handleGetCurrentPage = (page: number) => {
  pagination.currentPage = page
  getArticleList()
}
const handleNavigateToArticle = (article: IArticle) => {
  router.push({
    name: 'article',
    params: {
      aid: article.aid
    }
  })
}

const handlePreviousYear = () => {
  currentYear.value -= 1
  getArticleList()
  getArticleCount()
}
const handleNextYear = () => {
  currentYear.value += 1
  getArticleList()
  getArticleCount()
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
      }-01-01T00:00:00.000Z"}}}]}&order=-createdAt&limit=${
        pagination.size
      }&skip=${skip}`
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
      }-01-01T00:00:00.000Z"}}}]}&order=-createdAt&limit=${
        pagination.size
      }&skip=${skip}`
    )
    articles.value = data.results
  } else {
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"createdAt":{"$gte":{"__type":"Date","iso":"${
        currentYear.value
      }-01-01T00:00:00.000Z"},"$lt":{"__type":"Date","iso":"${
        currentYear.value + 1
      }-01-01T00:00:00.000Z"}}}&order=-createdAt&limit=${
        pagination.size
      }&skip=${skip}`
    )
    articles.value = data.results
  }
}

onMounted(() => {
  getArticleList()
  getArticleCount()
  showPage.value =
    detail.cid || detail.tid
      ? articles.value.length > 5
      : siteInfoStore.archivesCount > 5
})

watch(
  () => articles,
  (newValue) => {
    newValue.value.length === 0 ? (noData.value = true) : (noData.value = false)
  },
  {
    deep: true
  }
)
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
        <div class="actions" v-permission>
          <button class="edit-button" @click.stop="handleEditArticle(article)">
            编辑
          </button>
          <button
            class="remove-button"
            @click.stop="handleRemoveArticle(article)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      <Pagination
        button-color="#222"
        v-if="showPage"
        :pagination="pagination"
        @getCurrentPage="handleGetCurrentPage"
      />
    </div>
    <MessageBox
      v-model="showMessageBox"
      title="这是一条提示"
      content="是否确认删除"
      cancel-button-text="取消"
      confirm-button-text="确定"
      @handleCancel="handleCancel"
      @handleConfirm="handleConfirm"
    />
    <NoData v-if="noData" text="没有更多文章哦，waiting..." />
    <div
      class="more-action"
      v-if="noData && (detail.cid || detail.tid)"
      v-permission
    >
      是否要
      <span class="remove-button" @click="handleRemoveTagOrCategory">删除</span>
      当前{{ detail.cid ? '分类' : detail.tid ? '标签' : '' }}呢？
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
      box-sizing: border-box;
      animation: showup 0.5s ease-out forwards;
      .item-content {
        .item-meta {
          font-size: 14px;
          color: #999;
          vertical-align: bottom;
        }
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
      .actions {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        .edit-button,
        .remove-button {
          margin-left: 10px;
          border: 1px solid #222;
          transition: all 0.2s linear;
          border-radius: 5px;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          &:hover {
            background-color: #222;
            color: #fff;
          }
        }
      }
    }

    @keyframes showup {
      from {
        width: 80%;
        left: 100px;
        opacity: 0;
      }
      to {
        width: 100%;
        left: -1px;
        opacity: 1;
      }
    }
  }
  .more-action {
    text-align: center;
    .remove-button {
      font-weight: 600;
      color: #222;
      cursor: pointer;
      &:hover {
        border-bottom: 1px solid #222;
      }
    }
  }
}
</style>
