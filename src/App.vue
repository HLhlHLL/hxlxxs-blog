<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useElementStore } from './store/element'
import { basicCategories } from '@/mock/categories'
import { loadFull } from 'tsparticles'
import particles from '@/json/particles.json'
import Navigation from '@/components//Navigation/index.vue'
import SecondaryNav from '@/components//SecondaryNav/index.vue'
import SiteOverview from '@/components/SiteOverview/index.vue'
import TopBar from '@/components/TopBar/index.vue'
import Music from '@/components/Music/index.vue'

const global: any = inject('global')
const elementStore = useElementStore()
const headerRef = ref<HTMLElement | null>(null)
const headerHeight = ref<number>(0)
const options = ref<any>(particles)

const particlesInit = async (engine: any) => {
  await loadFull(engine)
}

const particlesLoaded = async (container: any) => {}

const getHeaderHeight = () => {
  if (headerRef.value) {
    const { height } = headerRef.value.getBoundingClientRect()
    if (height) {
      headerHeight.value = height
      elementStore.offsetTop = height
    }
  }
}

window.addEventListener('resize', getHeaderHeight)

// 头部滚动
const handleScrollHeader = () => {
  window.scrollTo({
    top: headerHeight.value,
    left: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  gsap.to('.icon-down', {
    y: 15,
    ease: 'power1.in',
    repeat: Infinity,
    yoyo: true,
    duration: 0.8,
    opacity: 0.2
  })

  setTimeout(() => {
    getHeaderHeight()
  }, 300)
})

// const setBasicCate = async () => {
//   const res = await global.$http.post('/api/1.1/batch', {
//     requests: basicCategories.map((c) => {
//       return {
//         method: 'POST',
//         path: '/1.1/classes/categories',
//         body: {
//           ...c
//         }
//       }
//     })
//   })
//   console.log(res)
// }
</script>

<template>
  <div class="header" ref="headerRef">
    <span class="header-title tracking-in-expand">Welcome to Hxlxx's blog</span>
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
        <div class="site-info">
          <SiteOverview />
        </div>
      </div>
      <div class="secondary-nav-bar">
        <SecondaryNav />
      </div>
      <div class="content">
        <router-view> </router-view>
      </div>
    </div>
  </div>
  <div class="footer"></div>
  <Particles
    id="tsparticles"
    :particlesInit="particlesInit"
    :particlesLoaded="particlesLoaded"
    :options="options"
  />
  <Music />
  <TopBar />
</template>

<style scoped lang="scss">
.header {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f7f9;
  z-index: 1;
  .header-title {
    position: absolute;
    top: 50px;
    right: 100px;
    font-size: 40px;
    font-weight: 600;
    color: #fefefe;
    transform: skew(-20deg);
    transition: all 0.2s linear;
    text-shadow: 2px 0 5px rgba($color: #000000, $alpha: 0.8);
  }
  .tracking-in-expand {
    -webkit-animation: tracking-in-expand 0.7s
      cubic-bezier(0.215, 0.61, 0.355, 1) both;
    animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
  }
  @-webkit-keyframes tracking-in-expand {
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes tracking-in-expand {
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  .header-img {
    display: block;
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
    transition: all 0.2s linear;
    .button-text {
      display: inline-block;
      transform: skew(-10deg);
      text-shadow: 2px 0 4px rgba($color: #000000, $alpha: 0.5);
    }
    .icon-down {
      font-size: 40px;
      width: 100%;
      text-align: center;
      transition: all 0.2s linear;
      text-shadow: 0 2px 2px rgba($color: #000000, $alpha: 0.8);
    }
  }
}
.main {
  // min-width: 1300px;
  position: relative;
  z-index: 1;
  .main-inner {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 0 auto;
    .side-bar {
      width: 240px;
      .site-info {
        position: sticky;
        top: 10px;
      }
    }
    .secondary-nav-bar {
      display: none;
      background-color: #222;
    }

    .content {
      width: calc(100% - 250px);
      min-width: 300px;
      padding: 30px;
      background-color: #fff;
      box-sizing: border-box;
    }
  }
}
.footer {
  height: 400px;
}

@media screen and (min-width: 1280px) {
  .header {
    height: 100vh;
  }
}

@media screen and (max-width: 960px) {
  .header {
    .header-title,
    .pulldown-button {
      font-size: 20px;
    }
    .header-title {
      top: 20px;
      right: 40px;
    }
    .pulldown-button {
      .icon-down {
        font-size: 20px;
      }
    }
  }
  .main {
    min-width: 250px;
    .main-inner {
      flex-direction: column;
      width: 100%;
      margin: 0;
      .side-bar {
        display: none;
      }
      .secondary-nav-bar {
        display: block;
      }
      .content {
        width: 100%;
      }
    }
  }
  .music {
    display: none;
  }
}
</style>
