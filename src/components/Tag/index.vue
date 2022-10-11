<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['handleCLoseTag'])
const close = ref<boolean>(false)
const handleCloseTag = () => {
  close.value = true
  emit('handleCLoseTag')
}
</script>

<template>
  <span class="tag" v-if="!close">
    <span class="content">
      <slot></slot>
    </span>
    <i class="iconfont icon-close" @click="handleCloseTag"></i>
  </span>
</template>

<style scoped lang="scss">
.tag {
  display: inline-block;
  margin: 10px;
  padding: 5px 5px 5px 10px;
  border: 2px solid #222;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    background: #222;
    color: #fff;
  }
  .icon-close {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
