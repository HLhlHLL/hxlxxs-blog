<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'
import { ICategory } from '@/types/index'
import { v4 as uuidv4 } from 'uuid'

export interface ICategorySelector {
  restSelector: () => void
  getSelectorValues: () => void
}

type PropsData = {
  placeholder: string
  categories: ICategory[]
  currentCategory: ICategory
}

const emit = defineEmits(['handleValueChange'])
const props = withDefaults(defineProps<PropsData>(), {
  placeholder: ''
})
const level1IptValue = ref<string>('')
const level2IptValue = ref<string>('')
const value = ref<ICategory[]>([])

const handleIptValueChange = (level: number) => {
  if (level === 1 && level1IptValue.value !== undefined) {
    value.value[0] = {
      categoryName: level1IptValue.value,
      cid: uuidv4()
    }
  } else if (level === 2 && value.value[0] !== undefined) {
    value.value[1] = {
      cid: uuidv4(),
      pid: value.value[0].cid,
      categoryName: level2IptValue.value
    }
  }
  emit('handleValueChange', value.value)
}

const fold = ref<boolean>(true)

const handleSelectItem = (item: ICategory) => {
  level1IptValue.value = item.categoryName
  item.isExist = true
  value.value[0] = item
  emit('handleValueChange', value.value)
  gsap.to('.selector', {
    top: -20,
    opacity: 0,
    height: 0,
    duration: 0.5,
    ease: 'power.out'
  })
  fold.value = !fold.value
}

const handleOpenOrCloseSelector = () => {
  fold.value = !fold.value
  if (!fold.value) {
    gsap.to('.selector', {
      top: 0,
      opacity: 1,
      height: 160,
      duration: 0.5,
      ease: 'power.in'
    })
  } else {
    gsap.to('.selector', {
      top: -20,
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power.out'
    })
  }
}

watch(
  () => props.currentCategory,
  (newValue) => {
    if (newValue.pid) {
      const current = props.categories.find((c) => c.cid === newValue.pid)
      level1IptValue.value = current?.categoryName || ''
      level2IptValue.value = newValue.categoryName
    } else {
      level1IptValue.value = newValue.categoryName
    }
  }
)

document.addEventListener('click', function (e) {
  if (
    (e.target as HTMLElement).className !== 'selector-item' &&
    (e.target as HTMLElement).className !== 'iconfont icon-next category' &&
    !fold.value
  ) {
    gsap.to('.selector', {
      top: -20,
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power.out'
    })
    fold.value = !fold.value
  }
})

const restSelector = () => {
  level1IptValue.value = ''
  level2IptValue.value = ''
  value.value = []
}

const getSelectorValues = () => {
  emit('handleValueChange', value.value)
  console.log(value.value)
}
defineExpose({
  restSelector,
  getSelectorValues
})
</script>

<template>
  <div class="category-selector">
    <div class="selector-lv1">
      <div class="selected">
        <span>一级分类：</span>
        <div class="selected-value">
          <span class="hide">{{ level1IptValue || props.placeholder }}</span>
          <input
            type="text"
            v-model.trim="level1IptValue"
            :placeholder="props.placeholder"
            @change="handleIptValueChange(1)"
          />
        </div>
        <div
          :class="['selector-button', fold ? '' : 'rotating']"
          @click="handleOpenOrCloseSelector"
        >
          <i class="iconfont icon-next category"></i>
        </div>
      </div>
      <ul class="selector">
        <li
          class="selector-item"
          v-for="item in props.categories"
          :key="item.cid"
          @click="handleSelectItem(item)"
        >
          {{ item.categoryName }}
        </li>
      </ul>
    </div>
    <div class="selector-lv2">
      <div class="selected">
        <span>二级分类：</span>
        <div class="selected-value">
          <span class="hide">{{ level2IptValue || props.placeholder }}</span>
          <input
            type="text"
            v-model.trim="level2IptValue"
            :placeholder="
              !level1IptValue ? '请先选择一级分类' : '请输入自定义分类名称'
            "
            :disabled="!level1IptValue"
            @change="handleIptValueChange(2)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.category-selector {
  display: flex;
  .selector-lv1 {
    position: relative;
    display: inline-block;
    .selected {
      display: flex;
      align-items: center;
      padding: 10px;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e6e6e6;
      .selected-value {
        position: relative;
        min-width: 130px;
        .hide {
          visibility: hidden;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 25px;
          font-size: 16px;
          outline: none;
          border: none;
        }
      }
      .selector-button {
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.2s linear;
        .icon-next:hover {
          color: #999;
        }
      }
      .rotating {
        transform: rotate(180deg);
      }
    }
    .selector {
      position: relative;
      top: -60px;
      max-height: 160px;
      height: 0;
      opacity: 0;
      padding: 0;
      list-style: none;
      line-height: 2;
      border: 1px solid #e6e6e6;
      overflow-y: overlay;
      overflow-x: hidden;
      user-select: none;
      .selector-item {
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #f5f7f9;
        }
      }
    }
  }
  .selector-lv2 {
    margin-left: 60px;
    display: inline-block;
    .selected {
      display: flex;
      align-items: center;
      padding: 10px;
      height: 25px;
      line-height: 25px;
      border: 1px solid #e6e6e6;
      .selected-value {
        position: relative;
        min-width: 130px;
        .hide {
          visibility: hidden;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 25px;
          font-size: 16px;
          outline: none;
          border: none;
        }
      }
      .selector-button {
        margin-left: 10px;
        cursor: pointer;
        .icon-next:hover {
          color: #999;
        }
      }
    }
  }
}
</style>
