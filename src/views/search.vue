<script setup lang="ts">
import { IArticle } from '@/types'
import { inject, onMounted, ref } from 'vue'
import { debounce } from 'lodash'
import { useRouter } from 'vue-router'
import Tag from '@/components/Tag/index.vue'

const global: any = inject('global')
const router = useRouter()

const showInput = ref<boolean>(false)
const inputValue = ref<string>('')
const searchList = ref<IArticle[]>([])
const searchHistory = ref<string[]>([])

const getSearchResults = async () => {
  const keyword = inputValue.value.trim()
  if (!keyword) return
  const { data } = await global.$http.get(
    `/api/1.1/search/select?q=${keyword}&clazz=articles`
  )
  searchList.value = data.results
}

const handleSearching = debounce(getSearchResults, 200)

const handleNavigateToArticle = (article: IArticle) => {
  router.push({
    name: 'article',
    params: {
      aid: article.aid,
      objectId: article.objectId
    }
  })
}

const handleCleanInput = () => {
  inputValue.value = ''
  searchList.value = []
}

const handleCloseTag = (history: string) => {
  searchHistory.value = searchHistory.value.filter((h) => h !== history)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const handleClickTag = (history: string) => {
  inputValue.value = history
  getSearchResults()
}

document.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement
  if (
    target.className !== 'search-input' &&
    target.className !== 'result-item'
  ) {
    showInput.value = false
    handleCleanInput()
  }
  if (inputValue.value.trim()) {
    if (!searchHistory.value.includes(inputValue.value)) {
      searchHistory.value.push(inputValue.value.trim())
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
  }
})

onMounted(() => {
  searchHistory.value = JSON.parse(
    localStorage.getItem('searchHistory') || '[]'
  )
})
</script>

<template>
  <div class="search animate__animated animate__fadeIn">
    <div class="search-title"><span>search</span></div>
    <transition name="button" mode="out-in">
      <div class="search-button" v-if="!showInput">
        <button @click.stop="showInput = !showInput">
          <i class="iconfont icon-search"></i>
          <span>search</span>
        </button>
      </div>
    </transition>
    <transition name="input" mode="out-in">
      <div class="search-box" v-if="showInput">
        <div class="input-wrap">
          <input
            class="search-input"
            type="text"
            placeholder="你想看点什么？"
            v-model="inputValue"
            @input="handleSearching"
          />
          <i class="iconfont icon-close" @click.stop="handleCleanInput"></i>
        </div>
        <div class="history-box">
          <div
            class="search-history"
            v-if="searchHistory.length > 0 && searchList.length === 0"
          >
            <span class="history-label">搜索历史：</span>
            <Tag
              v-for="history in searchHistory"
              :key="history"
              @handleCloseTag="handleCloseTag(history)"
              @handleClickTag="handleClickTag(history)"
              >{{ history }}</Tag
            >
          </div>
        </div>
        <ul class="results" v-if="searchList.length > 0">
          <li
            class="result-item"
            v-for="res in searchList"
            :key="res.objectId"
            @click="handleNavigateToArticle(res)"
          >
            {{ res.title }}
          </li>
        </ul>
        <div class="no-data" v-else>
          <span>没有更多搜索结果...</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  min-height: 600px;
  .search-title {
    text-align: center;
    font-size: 40px;
  }
  .search-button {
    position: absolute;
    top: 90px;
    left: 0;
    width: 100%;
    text-align: center;
    button {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      background-color: #fff;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: #222;
        color: #fff;
      }
      .icon-search {
        margin-right: 5px;
        font-size: 20px;
      }
    }
  }
  .search-box {
    position: absolute;
    top: 90px;
    left: 0;
    width: 100%;
    text-align: center;
    .input-wrap {
      position: relative;
      display: inline;
      .search-input {
        width: 80%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        outline: none;
        box-sizing: border-box;
      }
      .icon-close {
        position: absolute;
        top: 12px;
        right: 20px;
        transform: translateY(-50%);
        display: inline-block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 18px;
        border-radius: 50%;
        transition: all 0.2s linear;
        cursor: pointer;
        &:hover {
          background-color: #222;
          color: #fff;
        }
      }
    }
    .history-box {
      .search-history {
        text-align: start;
        margin-top: 20px;
      }
    }
    .results {
      padding: 0;
      margin: 20px 0;
      list-style: none;
      text-align: start;
      .result-item {
        padding: 10px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        border-bottom: 1px dashed #222;
        transition: all 0.2s linear;
        cursor: pointer;
        &:hover {
          background-color: #222;
          color: #fff;
        }
      }
    }
  }
  .search-list {
    padding: 0;
    margin: 40px 0;
    list-style: none;
    .search-item {
      padding: 10px 20px;
      margin-bottom: 20px;
      border-radius: 5px;
      border-bottom: 1px dashed #222;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: #222;
        color: #fff;
      }
    }
  }
  .no-data {
    margin-top: 40px;
    text-align: center;
  }
}

.button-enter-active,
.button-leave-active {
  transition: opacity 0.2s ease;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
}

.input-enter-active,
.input-leave-active {
  transition: opacity 0.2s ease;
}

.input-enter-from,
.input-leave-to {
  opacity: 0;
}
</style>
