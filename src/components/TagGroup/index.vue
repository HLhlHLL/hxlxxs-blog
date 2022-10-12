<script setup lang="ts">
import { ref, inject } from 'vue'
import Tag from '@/components/Tag/index.vue'
import { ITag } from '@/types'
import gsap from 'gsap'
import { v4 as uuidv4 } from 'uuid'

export interface ITagGroup {
  resetTag: () => void
}

type PropsData = {
  tags: ITag[]
  placeholder: string
}
const global: any = inject('global')
const emit = defineEmits(['handleTagChange'])
const props = defineProps<PropsData>()
const iptValue = ref<string>('')
const tags = ref<ITag[]>([])
const fold = ref<boolean>(true)
const isExist = ref<boolean>(false)

const handleAddTag = () => {
  // 去空
  if (!iptValue.value) {
    return global.$message({
      message: '标签不能为空',
      type: 'warning'
    })
  }
  // 去重
  if (tags.value.every((tag) => tag.tagName !== iptValue.value)) {
    tags.value.push({
      tagName: iptValue.value,
      tid: uuidv4(),
      isExist: isExist.value
    })
    isExist.value = false
    iptValue.value = ''
    emit('handleTagChange', tags.value)
  } else {
    iptValue.value = ''
    global.$message({
      message: '不能重复添加',
      type: 'warning'
    })
  }
}

const handleOpenOrCloseSelector = () => {
  fold.value = !fold.value
  if (!fold.value) {
    gsap.to('.tag-selector', {
      top: 0,
      opacity: 1,
      height: 160,
      duration: 0.5,
      ease: 'power.in'
    })
  } else {
    gsap.to('.tag-selector', {
      top: -20,
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power.out'
    })
  }
}

const handleCloseTag = (tag: any) => {
  tags.value = tags.value.filter((_tag) => _tag !== tag)
}

const handleSelectItem = (item: ITag) => {
  iptValue.value = item.tagName
  isExist.value = true
  gsap.to('.tag-selector', {
    top: -20,
    opacity: 0,
    height: 0,
    duration: 0.5,
    ease: 'power.out'
  })
  fold.value = !fold.value
}

document.addEventListener('click', function (e) {
  if (
    (e.target as HTMLElement).className !== 'selector-item' &&
    (e.target as HTMLElement).className !== 'iconfont icon-next tag' &&
    !fold.value
  ) {
    gsap.to('.tag-selector', {
      top: -20,
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power.out'
    })
    fold.value = !fold.value
  }
})

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
    <div class="selector-box">
      <div class="selected">
        <div class="selected-value">
          <span class="hide">{{ iptValue || props.placeholder }}</span>
          <input
            type="text"
            v-model.trim="iptValue"
            :placeholder="props.placeholder"
          />
        </div>
        <div
          :class="['selector-button', fold ? '' : 'rotating']"
          @click="handleOpenOrCloseSelector"
        >
          <i class="iconfont icon-next tag"></i>
        </div>
        <span class="add-tag-button" @click="handleAddTag">
          <i class="iconfont icon-plus"></i>
          <span>添加</span>
        </span>
      </div>
      <ul class="tag-selector">
        <li
          class="selector-item"
          v-for="item in props.tags"
          :key="item.tid"
          @click="handleSelectItem(item)"
        >
          {{ item.tagName }}
        </li>
      </ul>
    </div>
  </div>
  <ul class="tags">
    <Tag
      v-for="tag in tags"
      :key="tag.tid"
      @handleCloseTag="handleCloseTag(tag)"
    >
      {{ tag.tagName }}
    </Tag>
  </ul>
</template>

<style scoped lang="scss">
.add-tags {
  .selector-box {
    position: relative;
    display: inline-block;
    .selected {
      display: flex;
      align-items: center;
      padding: 10px;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e6e6e6;
      .selected-value {
        position: relative;
        min-width: 130px;
        .hide {
          visibility: hidden;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 25px;
          font-size: 16px;
          outline: none;
          border: none;
        }
      }
      .selector-button {
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.2s linear;
        .icon-next:hover {
          color: #999;
        }
      }
      .rotating {
        transform: rotate(180deg);
      }
      .add-tag-button {
        margin-left: 10px;
        padding-left: 10px;
        border-left: 1px solid #999;
        cursor: pointer;
        color: #222;
        &:hover {
          color: #999;
        }
      }
    }
    .tag-selector {
      position: relative;
      top: -60px;
      max-height: 160px;
      height: 0;
      opacity: 0;
      padding: 0;
      list-style: none;
      line-height: 2;
      border: 1px solid #e6e6e6;
      overflow-y: overlay;
      overflow-x: hidden;
      user-select: none;
      .selector-item {
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #f5f7f9;
        }
      }
    }
  }
}
.tags {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}
</style>
