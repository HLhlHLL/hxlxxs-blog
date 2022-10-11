<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import Navigation from '@/components//Navigation/index.vue'
import SiteOverview from '@/components/SiteOverview/index.vue'
import TopBar from '@/components/TopBar/index.vue'

onMounted(() => {
  gsap.to('.icon-down', {
    y: 15,
    ease: 'power1.in',
    repeat: Infinity,
    yoyo: true,
    duration: 0.8,
    opacity: 0.2
  })
})

// 头部滚动
const handleScrollHeader = () => {
  window.scrollTo({
    top: window.innerHeight,
    left: 0,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="header">
    <img class="header-img" src="@/assets/images/header-backGround.jpg" />
    <div class="pulldown-button" @click="handleScrollHeader">
      <span class="button-text">Let's go!</span>
      <div class="iconfont icon-down"></div>
    </div>
  </div>
  <div class="main">
    <div class="main-inner">
      <div class="side-bar">
        <div class="nav">
          <Navigation />
        </div>
        <div class="auth-info">
          <SiteOverview />
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <div class="footer"></div>
  <TopBar />
</template>

<style scoped lang="scss">
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f5f7f9;
  .header-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .pulldown-button {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 40px;
    color: #ddd;
    cursor: pointer;
    .icon-down {
      font-size: 40px;
      width: 100%;
      text-align: center;
    }
  }
}
.main {
  margin-top: 100vh;
  min-width: 1300px;
  .main-inner {
    display: flex;
    justify-content: space-between;
    width: 70%;
    margin: 0 auto;
    .side-bar {
      width: 240px;
      .auth-info {
        position: sticky;
        top: 10px;
      }
    }
    .content {
      width: calc(100% - 250px);
      padding: 30px;
      background-color: #fff;
      box-sizing: border-box;
    }
  }
}
.footer {
  height: 400px;
}
</style>
