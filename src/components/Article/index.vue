<script setup lang="ts">
import { useRouter } from 'vue-router'
import MDEditor from 'md-editor-v3'
import { IArticle, ICategory, IContentArticle } from '@/types/index'
import { HeadList } from 'md-editor-v3'

type PropsData = {
  article: IContentArticle | IArticle
  index?: number
  overview?: boolean
  loading?: boolean
}
const router = useRouter()
const emits = defineEmits(['getCatalog'])
const props = withDefaults(defineProps<PropsData>(), {
  overview: false
})

const handleNavigateToArticle = () => {
  router.push({
    name: 'article',
    params: {
      aid: props.article.aid,
      objectId: props.article.objectId
    }
  })
}

const handleNavigateToArticleList = (category: ICategory) => {
  router.push({
    name: 'category_articles',
    params: {
      category: category.categoryName,
      cid: category.cid
    }
  })
}

const handleGetCatalog = (list: HeadList[]) => {
  emits('getCatalog', list)
}
</script>

<template>
  <div class="article animate__animated animate__fadeIn">
    <header class="header">
      <div :class="['title', loading ? 'loading' : '']">
        <span class="title-text" @click="handleNavigateToArticle">
          {{ props.article.title || '' }}
          <div class="under-line"></div>
        </span>
      </div>
      <div class="details">
        <div class="article-meta">
          <span class="article-meta-item">
            <i class="iconfont icon-calendar"></i>
            <span class="text">发布于</span>
            <span class="date">
              <time
                :title="`发布于: ${dateFormat(
                  props.article.createdAt || ''
                ).format('YYYY-MM-DD')} \/ updated: ${dateFormat(
                  props.article.updatedAt || ''
                ).format('YYYY-MM-DD')}`"
              >
                {{
                  dateFormat(props.article.createdAt).format('YYYY-MM-DD') || ''
                }}
              </time>
            </span>
          </span>
          <span class="article-meta-item separator">
            <i class="iconfont icon-folder"></i>
            <span class="text">分类</span>
            <span
              class="category"
              @click="handleNavigateToArticleList(props.article.category)"
              >{{ props.article.category?.categoryName || '' }}</span
            >
          </span>
          <span class="article-meta-item separator">
            <i class="iconfont icon-eye"></i>
            <span class="text">阅读次数:</span>
            <span class="visited">{{
              props.article.meta?.visitedTimes || 0
            }}</span>
          </span>
          <span class="article-meta-item separator">
            <i class="iconfont icon-message"></i>
            <span class="text">Valine:</span>
            <span class="comments">{{ props.article.comment?.length }}</span>
          </span>
          <br />
          <span class="article-meta-item">
            <i class="iconfont icon-wordfile"></i>
            <span class="text">本文字数:</span>
            <span class="number-of-words">{{
              props.article.meta?.wordCount || 0
            }}</span>
          </span>
          <span class="article-meta-item separator">
            <i class="iconfont icon-clock"></i>
            <span class="text">阅读时长≈</span>
            <span class="duration"
              >{{ props.article.meta?.costTime || 0 }}分钟</span
            >
          </span>
        </div>
      </div>
      <div class="divider">
        <span class="div-mark"></span>
      </div>
    </header>
    <template v-if="overview">
      <div class="abstract">
        {{ props.article.abstract || '' }}
      </div>
      <div class="more">
        <button class="show-more-btn" @click="handleNavigateToArticle">
          <span class="btn-text">阅读全文</span>
          <i class="iconfont icon-double-right"></i>
        </button>
      </div>
      <footer class="footer">
        <div class="footer-mark"></div>
      </footer>
    </template>
    <template v-else>
      <div class="content">
        <MDEditor
          class="animate__animated animate__bounceIn"
          v-model="(article as IContentArticle).content"
          preview-only
          style="font-size: 18px"
          @onGetCatalog="handleGetCatalog"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.header {
  .title {
    width: 100%;
    min-height: 36px;
    font-size: 27px;
    text-align: center;
    .title-text {
      position: relative;
      .under-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #999;
        transition: all 0.2s linear;
      }
    }
    .title-text:hover {
      cursor: pointer;
    }
    .title-text:hover .under-line {
      left: 0;
      width: 100%;
    }
  }
  .loading {
    width: 100%;
  }
  .details {
    margin: 5px 0 40px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
    .article-meta-item {
      padding: 0 3px;
      line-height: 1.8;
      .iconfont {
        margin-right: 5px;
      }
      .text {
        margin-right: 5px;
      }
      .date {
        border-bottom: 1px dashed $text-color;
      }
      .date:hover,
      .category:hover {
        cursor: pointer;
      }
      .category {
        color: $text-color;
        border-bottom: 1px solid $text-color;
      }
    }
    .separator::before {
      content: '|';
      font-size: 1em;
      margin: 0 10px;
      vertical-align: top;
    }
    .article-meta-item:nth-child(1) {
      border-left: 0;
    }
  }
  .divider {
    .div-mark {
      display: block;
      margin: 40px auto 60px;
      width: 50%;
      height: 1px;
      background-color: #ccc;
    }
  }
}
.article {
  width: 100%;
  box-sizing: border-box;
  .abstract {
    margin-bottom: 40px;
    font-size: 18px;
    text-align: center;
  }
  .more {
    text-align: center;
    .show-more-btn {
      width: 130px;
      height: 36px;
      padding: 0 20px;
      font-size: 16px;
      border: 2px solid #222;
      border-radius: 5px;
      color: $text-color;
      background-color: #fff;
      transition: all 0.2s linear;
      cursor: pointer;
      .iconfont {
        font-size: 14px;
        margin-left: 2px;
      }
    }
    .show-more-btn:hover {
      background-color: #222;
      color: #fff;
    }
  }
  .footer {
    width: 100%;
    height: 20px;
    margin: 80px 0 60px;
    text-align: center;
    .footer-mark {
      width: 100%;
      height: 20px;
      background-color: #f7f7f7;
    }
  }
  .content {
    :deep(#md-editor-v3) p {
      font-size: 18px;
      line-height: 2.5;
    }
  }
}
</style>
