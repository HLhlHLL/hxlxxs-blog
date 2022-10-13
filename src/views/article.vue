<script setup lang="ts">
import { inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import Article from '@/components/Article/index.vue'
import Comments from '@/components/Comments/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { IArticle, IComment, ITag } from '@/types'
import { formatCommentTree } from '@/utils/shared'
import { useArticlesStore } from '@/store/articles'

const route = useRoute()
const router = useRouter()
const articleStore = useArticlesStore()
const global: any = inject('global')
const compData = reactive<any>({
  article: {}
})
const comment = ref<IComment[]>([])
const loading = ref<boolean>(true)
const currentArticleIndex = ref<number>(Number(route.params.index))
const relatedArticle = ref<IArticle[]>([])

const handleClickTag = (tag: ITag) => {
  router.push({
    name: 'tag_articles',
    params: {
      tag: tag.tagName,
      tid: tag.tid
    }
  })
}

// 跳转到对应索引的文章
const turnToAnotherArticle = () => {
  router.replace({
    name: 'article',
    params: {
      aid: articleStore.articleList[currentArticleIndex.value].aid,
      index: currentArticleIndex.value,
      objectId: articleStore.articleList[currentArticleIndex.value].objectId
    }
  })
}
// 跳转到下一篇或上一篇
const handleChangeArticle = (type: string) => {
  if (type === 'previous') {
    --currentArticleIndex.value
    turnToAnotherArticle()
  } else if (type === 'next') {
    ++currentArticleIndex.value
    turnToAnotherArticle()
  }
}
// 跳转到相关文章
const handleToRelatedArticle = (rel: IArticle) => {
  const res = articleStore.articleList.findIndex((a) => a.aid === rel.aid)
  currentArticleIndex.value = res
  turnToAnotherArticle()
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

onBeforeMount(() => {
  getArticleInfo()
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
  <div class="article animate__animated animate__fadeIn">
    <Article :article="compData.article" :loading="loading" />
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
        <span class="link" @click="handleToRelatedArticle(rel)">{{
          rel.title
        }}</span>
      </li>
    </ul>
    <div class="related-blank" v-else>
      <span>暂无更多相关文章</span>
    </div>
  </div>
  <div class="article-nav">
    <div class="pre-article" v-if="currentArticleIndex >= 1">
      <span @click="handleChangeArticle('previous')">
        <i class="iconfont icon-left"></i>
        {{ articleStore.articleList[currentArticleIndex - 1]?.title }}
      </span>
    </div>
    <div
      class="next-article"
      v-if="currentArticleIndex < articleStore.articleList.length - 1"
    >
      <span @click="handleChangeArticle('next')">
        {{ articleStore.articleList[currentArticleIndex + 1]?.title }}
        <i class="iconfont icon-right"></i>
      </span>
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
        <a href="javascript:;"></a>
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
</template>

<style scoped lang="scss">
.article {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
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
.article-nav {
  position: relative;
  width: 100%;
  margin: 40px 0;
  padding-top: 10px;
  border-top: 1px solid #eee;
  .pre-article {
    position: absolute;
    left: 0;
  }
  .next-article {
    position: absolute;
    right: 0;
  }
  span {
    cursor: pointer;
    &:hover {
      color: #999;
    }
  }
}
</style>
