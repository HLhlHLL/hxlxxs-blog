<script setup lang="ts">
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pathList, NavPath } from '@/components/Navigation/path'
import { useElementStore } from '@/store/element'

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
  <div class="secondary-nav">
    <ul class="nav-list">
      <li
        :class="['nav-item', path.active ? 'nav-item-active' : '']"
        v-for="path in pathList"
        :key="path.pathName"
        @click="handleNavigate(path)"
      >
        {{ path.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.secondary-nav {
  .nav-list {
    display: flex;
    height: 40px;
    line-height: 40px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: #fff;
    .nav-item {
      position: relative;
      width: calc(100% / 7);
      height: 100%;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s linear;
      &:nth-child(n + 2)::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -1px;
        transform: translateY(-50%);
        display: block;
        width: 2px;
        height: 21px;
        background-color: #666;
        box-sizing: border-box;
      }
      &:hover {
        background-color: #fff;
        color: #222;
        font-weight: 600;
      }
    }
  }
  .nav-item-active {
    color: #222;
    background-color: #fff;
  }
}
</style>
