<script setup lang="ts">
import { inject, nextTick, onBeforeMount, reactive, ref, watch } from 'vue'
import Article from '@/components/Article/index.vue'
import Comments from '@/components/Comments/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { IArticle, IComment, ITag } from '@/types'
import { formatCommentTree } from '@/utils/shared'
import { HeadList } from 'md-editor-v3'

const route = useRoute()
const router = useRouter()
const global: any = inject('global')

const compData = reactive<any>({
  article: {}
})
const comment = ref<IComment[]>([])
const loading = ref<boolean>(true)
const relatedArticle = ref<IArticle[]>([])
const catalogList = ref<HeadList[]>([])
const currentCatalog = ref<string>('')

const href = ref<string>('')

const handleClickTag = (tag: ITag) => {
  router.push({
    name: 'tag_articles',
    params: {
      tag: tag.tagName,
      tid: tag.tid
    }
  })
}

// 跳转到相关文章
const handleToRelatedArticle = (rel: IArticle) => {
  router.replace({
    name: 'article',
    params: {
      aid: rel.aid,
      objectId: rel.objectId
    }
  })
}

const getArticleInfo = async () => {
  try {
    const aid = route.params.aid
    const { data: res1 } = await global.$http.get(
      `/api/1.1/classes/contentArticle?where={"aid":"${aid}"}`
    )
    compData.article = res1.results[0]
    comment.value = formatCommentTree(res1.results[0].comment.slice(0)) || []
    loading.value = false
    const { data: res2 } = await global.$http.get(
      `/api/1.1/classes/articles?where={"cid": "${compData.article.cid}"}?limit=5`
    )
    relatedArticle.value = res2.results.filter(
      (r: any) => r.aid !== compData.article.aid
    )

    await global.$http.put(
      `/api/1.1/classes/contentArticle/${compData.article.objectId}`,
      {
        meta: {
          visitedTimes: compData.article.meta.visitedTimes + 1,
          wordCount: compData.article.meta.wordCount,
          costTime: compData.article.meta.costTime
        }
      }
    )
    const { data } = await global.$http.get(
      `/api/1.1/classes/articles?where={"aid": "${compData.article.aid}"}`
    )
    const res = data.results[0]
    await global.$http.put(`/api/1.1/classes/articles/${res.objectId}`, {
      meta: {
        visitedTimes: compData.article.meta.visitedTimes + 1,
        wordCount: compData.article.meta.wordCount,
        costTime: compData.article.meta.costTime
      }
    })

    compData.article.meta.visitedTimes++
  } catch (error) {}
}

// 目录滚动样式
const handleGetCatalog = (catalog: HeadList[]) => {
  if (catalog.length > 0) {
    catalogList.value = catalog
    const catalogIdList = catalog.map((catalog) => catalog.text)
    nextTick(() => {
      document.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
          currentCatalog.value = ''
        }
        catalogIdList.forEach((id) => {
          const el = document.getElementById(id)
          const { top } = el?.getBoundingClientRect() as DOMRect
          if (top <= 20 && top >= -100) {
            currentCatalog.value = id
          }
        })
      })
    })
  }
}
// 跳转到指定目录
const handleToCatalog = (catalog: HeadList) => {
  const el = document.getElementById(catalog.text)
  el?.scrollIntoView({
    behavior: 'smooth'
  })
}

onBeforeMount(() => {
  getArticleInfo()
  if (location) {
    href.value = location.href
  }
})

watch(
  () => route,
  () => {
    getArticleInfo()
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="article-detail animate__animated animate__fadeIn">
    <div class="article-main">
      <div class="article-content">
        <Article
          :article="compData.article"
          :loading="loading"
          @get-catalog="handleGetCatalog"
        />
      </div>
      <div class="divider">
        <div class="div-mark"></div>
      </div>
      <div class="tags">
        <strong>Tags:</strong>
        <span
          class="tag"
          v-for="tag in compData.article.tags"
          :key="tag.tid"
          @click="handleClickTag(tag)"
        >
          # {{ tag.tagName }}
        </span>
      </div>
      <div class="related-articles">
        <div class="text">相关文章</div>
        <ul v-if="relatedArticle.length > 0">
          <li class="title" v-for="rel in relatedArticle" :key="rel.aid">
            <span class="link" @click="handleToRelatedArticle(rel)">
              {{ rel.title }}
            </span>
          </li>
        </ul>
        <div class="related-blank" v-else>
          <span>暂无更多相关文章</span>
        </div>
      </div>
      <div class="copyright">
        <ul>
          <li class="copyright-author">
            <strong>本文作者:</strong>
            hxlxx
          </li>
          <li class="copyright-link">
            <strong>本文链接:</strong>
            <a v-if="href" :href="href">{{ href }}</a>
          </li>
          <li class="copyright-license">
            <strong>版权声明:</strong>
            本博客所有文章除特别声明外，均采用
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
              BY-NC-SA
            </a>
            许可协议。转载请注明出处！
          </li>
        </ul>
      </div>
      <div class="followme">
        <span>联系我</span>
        <div class="social-list">
          <div class="social-item">
            <i class="iconfont icon-QQ"></i>
            QQ
          </div>
          <div class="social-item">
            <i class="iconfont icon-weixin"></i>
            WeChat
          </div>
        </div>
      </div>
      <Comments :comment="comment" :article="compData.article" />
    </div>
    <div class="article-catalog">
      <div class="catalog-title">
        <span>目录</span>
      </div>
      <ul class="catalog-list">
        <li
          :class="[
            'catalog-item',
            `catalog-lv-${catalog.level}`,
            currentCatalog === catalog.text ? 'active' : ''
          ]"
          v-for="(catalog, index) in catalogList"
          :key="index"
          @click="handleToCatalog(catalog)"
        >
          {{ catalog.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-detail {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  .article-main {
    flex: 1;
    min-width: 0;
    .divider {
      width: 100%;
      height: 4px;
      margin: 20px 0 60px;
      .div-mark {
        width: 100%;
        height: 4px;
        background-image: repeating-linear-gradient(
          -45deg,
          #ddd,
          #ddd 4px,
          transparent 4px,
          transparent 8px
        );
      }
    }
    .tags {
      margin-bottom: 40px;
      strong {
        margin-right: 20px;
      }
      .tag {
        margin-right: 20px;
        font-size: 14px;
        color: #555;
        border-bottom: 1px solid #555;
        cursor: pointer;
        &:hover {
          color: #999;
          border-color: #999;
        }
      }
    }
    .related-articles {
      .title {
        line-height: 2;
        font-size: 14px;
        .link {
          color: #555;
          border-bottom: 1px solid #555;
          cursor: pointer;
          &:hover {
            color: #999;
            border-color: #999;
          }
        }
      }
      .related-blank {
        margin-top: 20px;
        font-size: 14px;
        color: #999;
      }
    }
    .copyright {
      margin-top: 40px;
      background-color: #f5f5f5;
      border-left: 4px solid #555;
      word-break: break-all;
      ul {
        padding: 20px;
        margin: 0;
        list-style: none;
        li {
          line-height: 2;
          strong {
            margin-right: 15px;
          }
        }
      }
    }
    .followme {
      text-align: center;
      line-height: 1.5;
      padding: 15px;
      margin-top: 40px;
      border-left: 4px solid #555;
      background-color: #f5f5f5;
      .social-list {
        display: flex;
        justify-content: center;
        .social-item {
          display: flex;
          flex-direction: column;
          padding: 20px;
          cursor: pointer;
          .iconfont {
            font-size: 28px;
          }
        }
        .social-item:hover {
          color: #222;
        }
      }
    }
  }
  .article-catalog {
    position: sticky;
    top: 50px;
    right: 50px;
    padding: 5px 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px 5px rgba($color: #eee, $alpha: 0.3);
    .catalog-title {
      width: 100%;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
    }
    .catalog-list {
      line-height: 2;
      list-style: none;
      padding: 0;
      .catalog-item {
        padding-right: 5px;
        border-left: 2px solid #fff;
        box-sizing: border-box;
        cursor: pointer;
      }

      .catalog-lv-1 {
        padding-left: 5px;
        font-size: 18px;
      }
      .catalog-lv-2 {
        font-size: 16px;
        padding-left: 15px;
      }
      .catalog-lv-3 {
        font-size: 14px;
        padding-left: 30px;
      }
      .active {
        border-left: 2px solid #00a4ff;
        background-color: rgba(0, 164, 255, 0.3);
      }
    }
  }
}
</style>
