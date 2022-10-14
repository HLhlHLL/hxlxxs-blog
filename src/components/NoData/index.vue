<script setup lang="ts">
import {} from 'vue'
type PropsData = {
  text: string
}
const props = withDefaults(defineProps<PropsData>(), {
  text: '这是一段默认文本'
})
</script>

<template>
  <div class="no-data">
    <span>{{ props.text }}</span>
  </div>
</template>

<style scoped lang="scss">
.no-data {
  text-align: center;
  margin: 100px 0;
  span {
    font-size: 20px;
  }
}
</style>
