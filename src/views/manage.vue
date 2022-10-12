<script setup lang="ts">
import { useUser } from '@/store/user'
import {} from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUser()

onBeforeRouteLeave((to, from) => {
  if (to.name === 'newarticle') {
    const token = sessionStorage.getItem('sessionToken')
    if (token && token === userStore.sessionToken) {
      return true
    } else {
      router.push({ name: 'home' })
    }
  }
})
</script>

<template>
  <div class="manage">
    <div class="manage-box">
      <div class="manage-title">
        <span>你想做点什么</span>
      </div>
      <ul class="menu">
        <li class="menu-item">
          <router-link to="/newarticle">写点文章</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.manage {
  .manage-box {
    .manage-title {
      font-size: 40px;
      text-align: center;
    }
    .menu {
      list-style: none;
      padding: 0;
      .menu-item {
        margin-top: 40px;
        a {
          transition: all 0.1s linear;
          cursor: pointer;
          color: #222;
        }
        a:hover {
          font-size: 24px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
