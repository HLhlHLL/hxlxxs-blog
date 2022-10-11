<script setup lang="ts">
import { computed, reactive } from 'vue'
type Pagination = {
  total: number
  size: number
  range: number
  currentPage: number
}
type propData = {
  pagination: Pagination
  buttonColor?: string
}
const props = defineProps<propData>()
const getButtonStyle = (page: number) => {
  if (props.pagination.currentPage === page) {
    return reactive({
      backgroundColor: props.buttonColor || '#fff',
      color: '#fff'
    })
  }
}

defineEmits(['getCurrentPage'])

const startAndEnd = computed(() => {
  let start =
    props.pagination.currentPage - Math.floor(props.pagination.range / 2)
  let end =
    props.pagination.currentPage + Math.floor(props.pagination.range / 2)
  if (start < 2) {
    start = 1
    end = props.pagination.range
  }
  if (end > Math.ceil(props.pagination.total / props.pagination.size) - 1) {
    end = Math.ceil(props.pagination.total / props.pagination.size)
    start = end - props.pagination.range
  }
  return {
    start,
    end
  }
})

const totalPage = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.size)
)
</script>

<template>
  <div class="pagination">
    <span
      class="page arrow"
      v-if="props.pagination.currentPage > 1"
      @click="$emit('getCurrentPage', props.pagination.currentPage - 1)"
    >
      <i class="iconfont icon-left"></i>
    </span>
    <span
      class="page"
      :style="getButtonStyle(1)"
      v-if="startAndEnd.start > 1"
      @click="$emit('getCurrentPage', 1)"
    >
      1
    </span>
    <span v-if="startAndEnd.start > 1">...</span>
    <template v-for="page in startAndEnd.end" :key="page">
      <span
        class="page"
        :style="getButtonStyle(page)"
        v-if="page >= startAndEnd.start"
        @click="$emit('getCurrentPage', page)"
      >
        {{ page }}
      </span>
    </template>
    <span v-if="startAndEnd.end < totalPage">...</span>
    <span
      class="page"
      :style="getButtonStyle(totalPage)"
      v-if="startAndEnd.end < totalPage"
      @click="$emit('getCurrentPage', totalPage)"
    >
      {{ totalPage }}
    </span>
    <span
      class="page arrow"
      v-if="props.pagination.currentPage < totalPage"
      @click="$emit('getCurrentPage', props.pagination.currentPage + 1)"
    >
      <i class="iconfont icon-right"></i>
    </span>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
}

span {
  display: block;
  margin: 10px;
  width: 30px;
  height: 30px;
  line-height: 25px;
  text-align: center;
  user-select: none;
  color: #555;
}
.page {
  border-radius: 5px;
  border: 2px solid #666;
  cursor: pointer;
  box-sizing: border-box;
}
.page:hover {
  background-color: #222;
  color: #fff;
}
.arrow {
  .iconfont {
    font-size: 14px;
  }
}
</style>
