<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import MdEditor from 'md-editor-v3'
import Comments from '@/components/Comments/index.vue'
import { IComment } from '@/types'
import { formatCommentTree } from '@/utils/shared'

const global: any = inject('global')

const text = ref<string>('# hello\r\n ## 本人前端新人一枚，欢迎你的来访！')
const comment = ref<IComment[]>([])

const getCommentList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/comments')
  comment.value = formatCommentTree(data.results[0]?.aboutComment)
}

onBeforeMount(() => {
  getCommentList()
})
</script>

<template>
  <div class="about animate__animated animate__fadeIn">
    <div class="about-title">
      <span>About Me</span>
    </div>
    <div class="about-content">
      <MdEditor v-model="text" preview-only />
    </div>
  </div>
  <div class="comments">
    <Comments :comment="comment" page="about" />
  </div>
</template>

<style scoped lang="scss">
.about {
  .about-title {
    font-size: 40px;
    text-align: center;
  }
}
</style>
