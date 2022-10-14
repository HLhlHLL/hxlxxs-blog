<script setup lang="ts">
import { Directive, inject, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IArticle } from '@/types'
import { useUser } from '@/store/user'
import { useArticlesStore } from '@/store/articles'
import Pagination from '@/components/Pagination/index.vue'
import MessageBox from '../MessageBox/index.vue'
import NoData from '@/components/NoData/index.vue'

type PropsData = {
  payload?: string
}

const route = useRoute()
const router = useRouter()
const articleStore = useArticlesStore()
const userStore = useUser()
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
const toRemoveArticle = ref<IArticle>()
const showMessageBox = ref<boolean>(false)

const vPermission: Directive = (el: HTMLElement) => {
  const token = sessionStorage.getItem('sessionToken')
  if (token !== userStore.sessionToken) {
    el.remove()
  }
}

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
const handleCancel = () => {
  global.$message({
    message: '取消了删除操作',
    type: 'info'
  })
}
const handleConfirm = async () => {
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
}

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
        v-if="pagination.total > 5"
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
    <NoData v-if="articles.length === 0" text="没有更多文章哦，waiting..." />
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
}
</style>
