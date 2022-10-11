<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
const ratio = ref<number>(50)
const showTopBar = ref<boolean>(true)

// 处理滚动事件
const handleShowTopBar = () => {
  const handlePageScroll = () => {
    const pageHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    const scrollY = window.scrollY
    ratio.value = Math.round((scrollY / (pageHeight - clientHeight)) * 100)
    if (ratio.value >= 10) {
      gsap.to('.top-bar', { y: -50, ease: 'power1.out' })
    } else {
      gsap.to('.top-bar', { y: 50, ease: 'power1.in' })
    }
  }
  window.addEventListener('scroll', handlePageScroll)
}
onMounted(() => {
  handleShowTopBar()
})

// 返回顶部
const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="top-bar" v-show="showTopBar" @click="handleScrollToTop">
    <i class="iconfont icon-top"></i>
    <span class="ratio">{{ ratio }}%</span>
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  position: fixed;
  bottom: -20px;
  right: 50px;
  width: 50px;
  font-size: 12px;
  text-align: center;
  color: #eee;
  border-radius: 4px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  cursor: pointer;
  z-index: 2;
  .ratio {
    vertical-align: top;
  }
}
</style>
