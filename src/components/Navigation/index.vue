<script setup lang="ts">
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pathList, NavPath } from './data'

const router = useRouter()
const route = useRoute()
const handleNavigate = (path: NavPath) => {
  pathList.forEach((p) => {
    p.active = false
    if (p.pathName === path.pathName) {
      p.active = true
    }
  })
  router.push({ path: path.pathName })
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
    <div
      :class="['nav-bar', path.active ? 'nav-bar-active' : '']"
      v-for="path in pathList"
      :key="path.pathName"
      @click="handleNavigate(path)"
    >
      <i :class="['iconfont', `icon-${path.pathIcon}`]"></i>
      {{ path.text }}
    </div>
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
  .nav-bar {
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
  .nav-bar:hover {
    cursor: pointer;
    background-color: $bg-color;
  }
  .nav-bar-active {
    background-color: $bg-color;
  }
  .nav-bar-active::after {
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
</style>
