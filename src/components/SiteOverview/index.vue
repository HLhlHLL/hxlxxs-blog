<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const global: any = inject('global')

const router = useRouter()
const archivesCount = ref<number>()
const tagsCount = ref<number>()
const categoriesCount = ref<number>()
const loginRef = ref<HTMLElement | null>(null)
const username = ref<string>('')
const password = ref<string>('')

let fold = true
const handleAddArticle = () => {
  if (sessionStorage.getItem('sessionToken')) {
    router.push({ name: 'newarticle' })
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
        sessionStorage.setItem('sessionToken', data.sessionToken)
        username.value = ''
        password.value = ''
        handleAddArticle()
        global.$message({
          message: 'お帰り！！',
          type: 'success'
        })
        router.push({
          name: 'newarticle'
        })
      }
    } catch (error) {
      global.$message({
        message: '我不认识你哟',
        type: 'danger'
      })
    }
  }
}

// 分类数量统计
const getSiteInfo = async () => {
  const { data: arc } = await global.$http.get(
    '/api/1.1/classes/articles?limit=0&count=1'
  )
  archivesCount.value = arc.count
  const { data: cate } = await global.$http.get(
    '/api/1.1/classes/categories?limit=0&count=1'
  )
  tagsCount.value = cate.count
  const { data: tag } = await global.$http.get(
    '/api/1.1/classes/tags?limit=0&count=1'
  )
  categoriesCount.value = tag.count
}

onBeforeMount(() => {
  getSiteInfo()
})
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
          <button @click="handleLogin">登录</button>
        </div>
      </form>
    </div>
    <div class="site-box">
      <div class="avatar" @click="handleAddArticle">
        <img src="@/assets/images/avatar.jpg" alt="hxlxx" />
      </div>
      <div class="author">hxlxx</div>
      <div class="description">
        绘一纸潇湘，花盏玲珑如妆，雨落弦响，陌上芳华，醉影照天长
      </div>
      <div class="state">
        <router-link class="state-item" to="/archives">
          <span class="counter">{{ archivesCount }}</span>
          <span class="text">日志</span>
        </router-link>
        <router-link class="state-item" to="/tag">
          <span class="counter">{{ tagsCount }}</span>
          <span class="text">标签</span>
        </router-link>
        <router-link class="state-item" to="/category">
          <span class="counter">{{ categoriesCount }}</span>
          <span class="text">分类</span>
        </router-link>
      </div>
      <div class="links">
        <div class="label">
          <i class="iconfont icon-link"></i>
          <span>链接</span>
        </div>
        <div class="link-items">
          <div class="link">
            <i class="iconfont icon-github"></i>
            <span>github</span>
          </div>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 240px;
    padding: 18px 10px;
    background-color: #fff;
    box-sizing: border-box;
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
