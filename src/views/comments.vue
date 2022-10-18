<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import Comments from '@/components/Comments/index.vue'
import { IComment } from '@/types'
import { formatCommentTree } from '@/utils/shared'

const global: any = inject('global')

const comment = ref<IComment[]>([])

const getCommentList = async () => {
  const { data } = await global.$http.get('/api/1.1/classes/comments')
  comment.value = formatCommentTree(data.results[0]?.comment || [])
}

onBeforeMount(() => {
  getCommentList()
})
</script>

<template>
  <div class="comments animate__animated animate__fadeIn">
    <div class="comments-title">
      <span>欢迎给我留言</span>
    </div>
    <div class="tips-box">
      <div class="tips-title">想说的</div>
      <div class="tips">随便说说啦。。。</div>
    </div>
    <div class="comments-board">
      <Comments :comment="comment" page="comment" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.comments {
  .comments-title {
    text-align: center;
    font-size: 40px;
  }
  .tips-box {
    margin-top: 40px;
    .tips-title {
      font-size: 28px;
      font-weight: 600;
    }
    .tips {
      margin-top: 20px;
      padding: 20px;
      font-size: 20px;
      border-left: 4px solid #555;
      background-color: #fafafa;
    }
  }
}
</style>
