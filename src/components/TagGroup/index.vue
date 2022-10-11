<script setup lang="ts">
import { ref } from 'vue'
import Tag from '@/components/Tag/index.vue'

export interface ITagGroup {
  resetTag: () => void
}

type PropsData = {
  placeholder: string
}
const emit = defineEmits(['handleTagChange'])
const props = defineProps<PropsData>()
const iptValue = ref<string>('')

let tags = ref<string[]>([])
const handleAddTag = () => {
  // 去空
  if (!iptValue.value) return
  // 去重
  if (tags.value.every((tag) => tag !== iptValue.value)) {
    tags.value.push(iptValue.value)
    emit('handleTagChange', tags.value)
    iptValue.value = ''
  }
}
const handleCloseTag = (tag: any) => {
  tags.value = tags.value.filter((_tag) => _tag !== tag)
}

const resetTag = () => {
  iptValue.value = ''
  tags.value = []
}

defineExpose({
  resetTag
})
</script>

<template>
  <div class="add-tags">
    <div class="tag-input">
      <div class="tag-value">
        <span class="hide">{{ iptValue || props.placeholder }}</span>
        <input
          type="text"
          v-model.trim="iptValue"
          :placeholder="props.placeholder"
        />
      </div>
      <div class="add-tag-button">
        <i class="iconfont icon-plus" @click="handleAddTag"></i>
      </div>
    </div>
  </div>
  <ul class="tags">
    <Tag v-for="tag in tags" :key="tag" @handleCloseTag="handleCloseTag(tag)">{{
      tag
    }}</Tag>
  </ul>
</template>

<style scoped lang="scss">
.add-tags {
  display: inline-block;
  .tag-input {
    display: flex;
    padding: 10px;
    border: 1px solid #e6e6e6;
    .tag-value {
      position: relative;
      min-width: 130px;
      .hide {
        visibility: hidden;
      }
      input {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        font-size: 16px;
        outline: none;
        border: none;
      }
    }
    .add-tag-button {
      cursor: pointer;
      color: #222;
      .icon-plus:hover {
        color: #999;
      }
    }
  }
}
.tags {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-top: 10px;
  padding: 0;
}
</style>
