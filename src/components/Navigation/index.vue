<script setup lang="ts">
import { useElementStore } from '@/store/element'
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pathList, NavPath } from './path'

const router = useRouter()
const route = useRoute()
const elementStore = useElementStore()

const handleNavigate = (path: NavPath) => {
  pathList.forEach((p) => {
    p.active = false
    if (p.pathName === path.pathName) {
      p.active = true
    }
  })
  router.push({ path: path.pathName })
  window.scrollTo({
    top: elementStore.offsetTop,
    behavior: 'smooth'
  })
}

watch(
  () => route,
  (newVal) => {
    pathList.forEach((p) => {
      p.active = false
      if (newVal.path.indexOf(p.pathName) === 0) {
        p.active = true
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="navigation animate__animated animate__fadeIn">
    <ul class="nav-list">
      <li
        :class="['nav-item', path.active ? 'nav-item-active' : '']"
        v-for="path in pathList"
        :key="path.pathName"
        @click="handleNavigate(path)"
      >
        <i :class="['iconfont', `icon-${path.pathIcon}`]"></i>
        {{ path.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 240px;
  padding: 20px 0;
  margin-bottom: 10px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    .nav-item {
      position: relative;
      width: 100%;
      height: 36px;
      line-height: 26px;
      padding: 5px 20px;
      box-sizing: border-box;
      .iconfont {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .nav-item:hover {
      cursor: pointer;
      background-color: $bg-color;
    }
    .nav-item-active {
      background-color: $bg-color;
    }
    .nav-item-active::after {
      background: #bbb;
      border-radius: 50%;
      content: ' ';
      height: 6px;
      margin-top: -3px;
      position: absolute;
      right: 15px;
      top: 50%;
      width: 6px;
    }
  }
}
</style>
