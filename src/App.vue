<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useElementStore } from './store/element'
// import { basicCategories } from '@/mock/categories'
import Navigation from '@/components//Navigation/index.vue'
import SecondaryNav from '@/components//SecondaryNav/index.vue'
import SiteOverview from '@/components/SiteOverview/index.vue'
import TopBar from '@/components/TopBar/index.vue'
import Particle from '@/components/Particle/index.vue'
import Emoji from '@/plugin/emojiAnimation'

const elementStore = useElementStore()
const headerRef = ref<HTMLElement | null>(null)
const headerHeight = ref<number>(0)
const titleFontSize = ref<number>(0)
const buttonFontSize = ref<number>(0)
const headerTitleRef = ref<HTMLElement | null>(null)
const siteTitle = ref<string>("Welcome to Hxlxx's blog ~ ;-)")

const getHeaderHeight = () => {
  if (headerRef.value) {
    const { height } = headerRef.value.getBoundingClientRect()
    if (height) {
      headerHeight.value = height
      elementStore.offsetTop = height
    }
  }
}

const resizeText = () => {
  titleFontSize.value = document.body.clientWidth * 0.03
  buttonFontSize.value = document.body.clientWidth * 0.016
}

// 点击动画
const handleEmojiAnimation = (e: MouseEvent) => {
  let { pageX: x, pageY: y } = e
  const dx = (Math.random() - 0.5) * 20
  const dy = (Math.random() - 0.5) * 20
  const duration = 5
  const emoji = new Emoji(x, y, dx, dy, duration)

  emoji.render()
}

window.addEventListener('resize', getHeaderHeight)
window.addEventListener('resize', resizeText)
document.addEventListener('mouseup', handleEmojiAnimation, true)

// 头部滚动
const handleScrollHeader = () => {
  window.scrollTo({
    top: headerHeight.value,
    left: 0,
    behavior: 'smooth'
  })
}

// 打字机效果
const typing = () => {
  const words = siteTitle.value
    .split('')
    .map((s) => `<li><span>${s}</span></li>`)
  let timer = setInterval(() => {
    if (headerTitleRef.value) {
      if (words.length) {
        headerTitleRef.value.innerHTML += words.shift()
      } else {
        clearInterval(timer)
      }
    }
  }, 100)
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

  typing()
  resizeText()

  setTimeout(() => {
    getHeaderHeight()
  })
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
    <ul
      class="header-title"
      ref="headerTitleRef"
      :style="{
        fontSize: titleFontSize + 'px'
      }"
    ></ul>
    <img class="header-img" src="@/assets/images/header-backGround.jpg" />
    <div class="pulldown-button" @click="handleScrollHeader">
      <span
        class="button-text"
        :style="{
          fontSize: buttonFontSize + 'px'
        }"
        >Let's go!</span
      >
      <div
        class="iconfont icon-down"
        :style="{
          fontSize: buttonFontSize + 'px'
        }"
      ></div>
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
  <TopBar />
  <Particle />
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    font-weight: 600;
    white-space: pre;
    list-style: none;
    margin: 0;
    padding: 0 5px;
    color: #fff;
    animation: blink 0.8s linear infinite;
    font-family: 'Hanalei Fill', cursive;
  }
  @keyframes blink {
    from {
      border-right: 4px solid #000;
    }
    to {
      border-right: 4px solid #fff;
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
    font-size: 30px;
    color: #ddd;
    cursor: pointer;
    transition: all 0.1s linear;
    .button-text {
      font-family: 'Hanalei Fill', cursive;
      display: inline-block;
      transform: skew(-10deg);
      text-shadow: 2px 0 4px rgba($color: #000000, $alpha: 0.5);
    }
    .icon-down {
      font-size: 30px;
      width: 100%;
      text-align: center;
      transition: all 0.2s linear;
      text-shadow: 0 2px 2px rgba($color: #000000, $alpha: 0.8);
    }
  }
}
.main {
  position: relative;
  z-index: 1;
  .main-inner {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 0 auto;
    .side-bar {
      width: 240px;
      .nav,
      .site-info,
      .calendar-box {
        box-shadow: 0 0 5px 5px rgba($color: #eee, $alpha: 0.3);
      }
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
      box-shadow: 2px 0 5px 5px rgba($color: #eee, $alpha: 0.3);
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
    .pulldown-button {
      bottom: 20px;
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

  @keyframes blink {
    from {
      border-right: 2px solid #000;
    }
    to {
      border-right: 2px solid #fff;
    }
  }
}
</style>
