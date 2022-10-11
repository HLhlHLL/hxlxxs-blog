<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import MdEditor from 'md-editor-v3'
import CategorySelector, {
  ICategorySelector
} from '@/components/CategorySelector/index.vue'
import TagGroup, { ITagGroup } from '@/components/TagGroup/index.vue'
import { articleGenerator } from '@/utils/generator'
import { basicCategories } from '@/mock/categories'
import { ICategory } from '@/types/index'
import { mergeCategories } from '@/utils/shared'

const global: any = inject('global')
const title = ref<string>('')
const content = ref<string>('')
const abstract = ref<string>('')
const category = ref<ICategory[]>([])
const tags = ref<string[]>([])
const categoryList = ref<ICategory[]>([])

const handleValueChange = (value: ICategory[]) => {
  category.value = value
}

const handleTagChange = (tagList: string[]) => {
  tags.value = tagList
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
    category: c,
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

    await global.$http.post('/api/1.1/classes/categories', {
      ...c
    })

    const operation = t.map((item) => ({
      method: 'POST',
      path: '/1.1/classes/tags',
      body: {
        ...item
      }
    }))

    await global.$http.post('/api/1.1/batch', {
      requests: operation
    })

    global.$message({
      message: 'yes，发布成功！！',
      type: 'success'
    })
  } catch (error) {
    global.$message({
      message: '等等，好像出了点小问题...'
    })
  } finally {
    handleResetArticle()
  }
}

const getCategoryList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/categories')
  categoryList.value = mergeCategories(basicCategories, data.results)
}

onBeforeMount(() => {
  getCategoryList()
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
        :data="categoryList"
        :placeholder="'请选择分类或添加自定义分类名称'"
        @handleValueChange="handleValueChange"
      />
    </div>
    <div class="tags">
      <div class="tags-title">添加标签</div>
      <TagGroup
        ref="tagGroupRef"
        :placeholder="'添加标签'"
        @handleTagChange="handleTagChange"
      />
    </div>
    <div class="button-group">
      <button class="reset" @click="handleResetArticle">重置</button>
      <button class="submit" @click="handleSubmitNewArticle">提交</button>
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

  .button-group {
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
