<script setup lang="ts">
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/store/user'
import { useSiteInfoStore } from '@/store/siteinfo'
import { Path, pathList as data } from './path'
import gsap from 'gsap'
import { useElementStore } from '@/store/element'

const global: any = inject('global')
const router = useRouter()
const userStore = useUser()
const siteInfoStore = useSiteInfoStore()
const elementStore = useElementStore()

const pathList = ref<Path[]>(data)
const loginRef = ref<HTMLElement | null>(null)
const username = ref<string>('')
const password = ref<string>('')
const ifLogged = ref<boolean>(false)

const handleNavigate = (path: Path) => {
  router.push({ path: path.pathName })
  window.scrollTo({
    top: elementStore.offsetTop,
    behavior: 'smooth'
  })
}

let fold = true
const handleAddArticle = () => {
  const token = sessionStorage.getItem('sessionToken')
  if (token && token === userStore.sessionToken) {
    router.push({ name: 'manage' })
  } else {
    if (fold) {
      gsap.to('.login', {
        height: 150,
        duration: 0.5,
        ease: 'power1.out',
        visibility: 'visible'
      })
    } else {
      gsap.to('.login', {
        height: 0,
        duration: 0.5,
        ease: 'power1.in',
        onComplete() {
          this._targets[0].style.visibility = 'hidden'
        }
      })
    }
    fold = !fold
  }
}

const handleLogin = async () => {
  if (!username.value || !password.value) {
    return global.$message({
      message: '请输入神秘代码！！',
      type: 'danger'
    })
  } else {
    try {
      const { data } = await global.$http.post('/api/1.1/login', {
        username: username.value,
        password: password.value
      })
      if (data.sessionToken) {
        handleAddArticle()
        ifLogged.value = true
        userStore.sessionToken = data.sessionToken
        sessionStorage.setItem('sessionToken', data.sessionToken)
        username.value = ''
        password.value = ''
        global.$message({
          message: '欢迎欢迎，热烈欢迎！！',
          type: 'success'
        })
        router.push({ name: 'home' })
      }
    } catch (error) {
      global.$message({
        message: '我不认识你哟',
        type: 'danger'
      })
    }
  }
}

const handleLogout = () => {
  ifLogged.value = false
  sessionStorage.removeItem('sessionToken')
  userStore.sessionToken = ''
  router.push({ name: 'home' })
}

onBeforeMount(() => {
  // 分类数量统计
  siteInfoStore.getSiteInfo()
})

onMounted(() => {
  ifLogged.value =
    sessionStorage.getItem('sessionToken') === userStore.sessionToken
})

watch(
  () => siteInfoStore,
  (newValue) => {
    pathList.value.forEach((path) => {
      if (path.pathName === '/archives') {
        path.pathCount = newValue.archivesCount
      } else if (path.pathName === '/tag') {
        path.pathCount = newValue.tagsCount
      } else if (path.pathName === '/category') {
        path.pathCount = newValue.categoriesCount
      }
    })
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="site-overview animate__animated animate__fadeIn">
    <div class="login" ref="loginRef">
      <form class="login-form" @submit.prevent>
        <div class="title">
          <span>请输入神秘代码</span>
        </div>
        <div class="form-item">
          <div class="label"></div>
          <input type="text" autocomplete="off" v-model.trim="username" />
        </div>
        <div class="form-item">
          <div class="label"></div>
          <input type="password" autocomplete="off" v-model.trim="password" />
        </div>
        <div class="form-item">
          <button @click="handleLogin">进入</button>
        </div>
      </form>
    </div>
    <div class="site-box">
      <i
        class="iconfont icon-log-out"
        v-if="ifLogged"
        @click="handleLogout"
      ></i>
      <div class="avatar" @click="handleAddArticle">
        <img src="@/assets/images/avatar.jpg" alt="hxlxx" />
      </div>
      <div class="author">hxlxx</div>
      <div class="description">我把這陳年風褸，送贈你解咒</div>
      <div class="state">
        <div
          class="state-item"
          v-for="path in pathList"
          :key="path.pathName"
          @click="handleNavigate(path)"
        >
          <span class="counter">{{ path.pathCount }}</span>
          <span class="text">{{ path.text }}</span>
        </div>
      </div>
      <div class="links">
        <div class="label">
          <i class="iconfont icon-link"></i>
          <span>链接</span>
        </div>
        <div class="link-items">
          <a
            href="https://github.com/HLhlHLL/hxlxxs-blog/tree/master"
            target="_blank"
            class="link"
          >
            <i class="iconfont icon-github"></i>
            <span>github</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-overview {
  .login {
    position: relative;
    width: 100%;
    height: 0;
    visibility: hidden;
    background-color: #f5f7f9;
    box-sizing: border-box;
    z-index: -1;
    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-size: 14px;
        color: #999;
      }
      .form-item {
        margin-top: 10px;
        line-height: 1.8;
        input {
          height: 25px;
          padding: 0 10px;
          border: 1px solid #e6e6e6;
          border-radius: 5px;
        }
        button {
          padding: 5px 10px;
          border: 1px solid #e6e6e6;
          border-radius: 5px;
          color: $text-color;
          cursor: pointer;
          transition: all 0.2s linear;
          &:hover {
            background-color: #222;
            color: #fff;
          }
        }
      }
    }
  }
  .site-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 240px;
    padding: 18px 10px;
    background-color: #fff;
    box-sizing: border-box;
    .icon-log-out {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: #999;
      }
    }
    .avatar {
      width: 120px;
      height: 120px;
      cursor: pointer;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.2s linear;
        &:hover {
          filter: drop-shadow(0 0 5px #999);
        }
      }
    }
    .author {
      width: 100%;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-weight: bold;
    }
    .description {
      width: 100%;
      font-size: 14px;
      color: #999;
      line-height: 1.8;
      text-align: center;
      word-break: break-word;
      white-space: pre-line;
    }
    .state {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 20px 0;
      text-align: center;
      .state-item {
        display: flex;
        flex-direction: column;
        padding: 0 12px;
        box-sizing: border-box;
        .counter {
          font-weight: bold;
        }
        .text {
          font-size: 14px;
          color: #999;
        }
      }
      .state-item:nth-child(2) {
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
      }
      .state-item:hover {
        cursor: pointer;
      }
    }
    .links {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size: 14px;
      .label {
        font-weight: bolder;
        margin-bottom: 15px;
        .icon-link {
          margin-right: 5px;
        }
      }
      .link-items {
        display: grid;
        grid-template-columns: 1fr 1fr;
        .link {
          padding: 5px;
          border-radius: 5px;
          .iconfont {
            margin-right: 5px;
            font-size: 12px;
          }
        }
      }
      .link:hover {
        cursor: pointer;
        background-color: $bg-color;
      }
    }
  }
}
</style>
