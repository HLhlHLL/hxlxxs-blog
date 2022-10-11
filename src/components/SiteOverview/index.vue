<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { navList, Nav } from './data'

const global: any = inject('global')

const router = useRouter()
const navs = ref<Nav[]>(navList)

const handleNavigate = (nav: Nav) => {
  router.push({ path: nav.path })
}
const handleAddArticle = () => {
  router.push({ name: 'newarticle' })
}

const getSiteInfo = async () => {
  const { data: arc } = await global.$http.get(
    '/api/1.1/classes/articles?limit=0&count=1'
  )
  navs.value[0].count = arc.count
  const { data: cate } = await global.$http.get(
    '/api/1.1/classes/categories?limit=0&count=1'
  )
  navs.value[1].count = cate.count
  const { data: tag } = await global.$http.get(
    '/api/1.1/classes/tags?limit=0&count=1'
  )
  navs.value[2].count = tag.count
}

onBeforeMount(() => {
  getSiteInfo()
})
</script>

<template>
  <div class="author-info animate__animated animate__fadeIn">
    <div class="avatar" @click="handleAddArticle">
      <img src="@/assets/images/avatar.jpg" alt="hxlxx" />
    </div>
    <div class="author">hxlxx</div>
    <div class="description">
      绘一纸潇湘，花盏玲珑如妆，雨落弦响，陌上芳华，醉影照天长
    </div>
    <div class="state">
      <div
        class="state-item"
        v-for="nav in navList"
        :key="nav.count"
        @click="handleNavigate(nav)"
      >
        <span class="counter">{{ nav.count }}</span>
        <span class="text">{{ nav.text }}</span>
      </div>
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
</template>

<style scoped lang="scss">
.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
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
</style>
