<script setup lang="ts">
import { inject, onBeforeMount, onMounted, reactive, ref } from 'vue'
import MdEditor from 'md-editor-v3'
import CategorySelector, {
  ICategorySelector
} from '@/components/CategorySelector/index.vue'
import TagGroup, { ITagGroup } from '@/components/TagGroup/index.vue'
import { articleGenerator } from '@/utils/generator'
import { basicCategories } from '@/mock/categories'
import { ICategory, IContentArticle, ITag } from '@/types/index'
import { mergeCategories } from '@/utils/shared'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useSiteInfoStore } from '@/store/siteinfo'

type CompData = {
  article: IContentArticle
}

const global: any = inject('global')
const route = useRoute()
const siteInfoStore = useSiteInfoStore()
const compData = reactive<CompData>({
  article: {} as IContentArticle
})
const title = ref<string>('')
const content = ref<string>('')
const abstract = ref<string>('')
const category = ref<ICategory[]>([])
const tags = ref<ITag[]>([])
const categoryList = ref<ICategory[]>([])
const tagList = ref<ITag[]>([])

const handleValueChange = (value: ICategory[]) => {
  category.value = value
}

const handleTagChange = (value: ITag[]) => {
  tags.value = value
}

const tagGroupRef = ref<null | (InstanceType<typeof TagGroup> & ITagGroup)>(
  null
)
const categorySelectorRef = ref<
  null | (InstanceType<typeof CategorySelector> & ICategorySelector)
>(null)
const handleResetArticle = () => {
  tagGroupRef.value && tagGroupRef.value.resetTag()
  categorySelectorRef.value && categorySelectorRef.value.restSelector()
  title.value = ''
  abstract.value = ''
  content.value = ''
  category.value = []
  tags.value = []
}

const handleSubmitNewArticle = async () => {
  if (
    !(
      title.value &&
      abstract.value &&
      content.value &&
      category.value &&
      tags.value
    )
  ) {
    return global.$message({
      message: '请先完善文章信息',
      type: 'warning'
    })
  }
  const {
    article: a,
    tags: t,
    categories: c,
    contentArticle
  } = articleGenerator(
    title.value,
    abstract.value,
    content.value,
    category.value,
    tags.value
  )
  try {
    await global.$http.post('/api/1.1/classes/articles', {
      ...a
    })

    await global.$http.post('/api/1.1/classes/contentArticle', {
      ...contentArticle
    })

    await global.$http.post('/api/1.1/batch', {
      requests: c.map((_c) => ({
        method: 'POST',
        path: '/1.1/classes/categories',
        body: { ..._c }
      }))
    })

    await global.$http.post('/api/1.1/batch', {
      requests: t.map((_t) => ({
        method: 'POST',
        path: '/1.1/classes/tags',
        body: {
          ..._t,
          isExist: true
        }
      }))
    })
    siteInfoStore.getSiteInfo()
    global.$message({
      message: 'yes，发布成功！！',
      type: 'success'
    })
  } catch (error) {
    global.$message({
      message: '等等，好像出了点小问题...',
      type: 'danger'
    })
  } finally {
    handleResetArticle()
  }
}

const handleEditArticle = async () => {
  const article = compData.article
  const tit = title.value
  const con = content.value
  const abs = abstract.value
  const cat =
    category.value.length === 2
      ? category.value[1]
      : category.value[0] || article.category
  const t = tags.value.length > 0 ? tags.value : article.tags

  const oId = route.params.objectId
  try {
    await global.$http.put(
      `/api/1.1/classes/contentArticle/${article.objectId}`,
      {
        title: tit,
        content: con,
        abstract: abs,
        category: cat,
        tags: t,
        tid: t.map((t) => t.tid),
        meta: {
          visitedTimes: article.meta.visitedTimes,
          wordCount: con.length,
          costTime: Math.floor(con.length / 400) || 1
        }
      }
    )
    await global.$http.put(`/api/1.1/classes/articles/${oId}`, {
      title: tit,
      abstract: abs,
      category: cat,
      tags: t,
      tid: t.map((t) => t.tid),
      meta: {
        visitedTimes: article.meta.visitedTimes,
        wordCount: con.length,
        costTime: Math.floor(con.length / 400) || 1
      }
    })

    router.push({ name: 'home' })
    global.$message({
      message: '修改成功咯！！',
      type: 'success'
    })
  } catch (error) {
    global.$message({
      message: '修改出了点小差错！！',
      type: 'danger'
    })
  }
}

const getCategoryList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/categories')
  categoryList.value = mergeCategories(basicCategories, data.results)
}

const getTagList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/tags')
  tagList.value = data.results
}

onBeforeMount(() => {
  getCategoryList()
  getTagList()
})

const getArticle = async (aid: string) => {
  const { data } = await global.$http.get(
    `/api/1.1/classes/contentArticle?where={"aid": "${aid}"}`
  )
  compData.article = data.results[0]
  title.value = compData.article.title
  content.value = compData.article.content
  abstract.value = compData.article.abstract
}

onMounted(() => {
  const aid = route.params.aid as string
  if (aid) {
    getArticle(aid)
  }
})
</script>

<template>
  <div class="new-article animate__animated animate__fadeIn">
    <div class="title">
      <div class="text">标题</div>
      <input type="text" v-model="title" />
    </div>
    <div class="content">
      <div class="content-title">正文</div>
      <MdEditor v-model="content" />
    </div>
    <div class="abstract">
      <div class="abstract-title">摘要</div>
      <textarea rows="5" name="abstract" v-model="abstract"></textarea>
    </div>
    <div class="category">
      <div class="category-title">添加分类</div>
      <CategorySelector
        ref="categorySelectorRef"
        :categories="categoryList"
        :currentCategory="compData.article.category"
        :placeholder="'请选择分类或添加自定义分类名称'"
        @handleValueChange="handleValueChange"
      />
    </div>
    <div class="tags">
      <div class="tags-title">添加标签</div>
      <TagGroup
        ref="tagGroupRef"
        :placeholder="'添加标签'"
        :tags="tagList"
        :currentTags="compData.article.tags"
        @handleTagChange="handleTagChange"
      />
    </div>
    <div class="actions">
      <div class="actions-add" v-if="!route.params.aid">
        <button class="reset" @click="handleResetArticle">重置</button>
        <button class="submit" @click="handleSubmitNewArticle">提交</button>
      </div>
      <div class="actions-edit" v-else>
        <button class="edit" @click="handleEditArticle">确认修改</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.new-article {
  .title {
    .text {
      font-size: 20px;
      margin-bottom: 20px;
    }

    input {
      width: 100%;
      padding: 10px 20px;
      font-size: 18px;
      border: 1px solid #e6e6e6;
      outline: none;
      box-sizing: border-box;
    }
  }

  .content {
    margin-top: 30px;

    .content-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  .abstract {
    margin-top: 30px;

    .abstract-title {
      font-size: 20px;
      margin-bottom: 20px;
    }

    textarea {
      width: 100%;
      padding: 20px;
      font-size: 18px;
      box-sizing: border-box;
      resize: none;
      border-color: #e6e6e6;
      outline: none;
    }
  }

  .category {
    margin-top: 30px;

    .category-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  .tags {
    .tags-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }

  .actions {
    margin-top: 20px;
    text-align: center;

    button {
      margin: 10px 20px;
      font-size: 18px;
      border: 1px solid #e6e6e6;
      padding: 5px 20px;
      background-color: #fff;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.2s linear;

      &:hover {
        background-color: #222;
        color: #fff;
      }
    }

    .reset {
      background-color: #222;
      color: #fff;

      &:hover {
        background-color: #fff;
        color: #222;
      }
    }
  }
}
</style>
