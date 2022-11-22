<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useCanvas from './useCanvas/index'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    useCanvas(canvasRef.value)
    window.addEventListener('resize', () => {
      useCanvas(canvasRef.value as HTMLCanvasElement)
    })
  }
})
</script>

<template>
  <Teleport to="body">
    <canvas id="cvs" ref="canvasRef"></canvas>
  </Teleport>
</template>

<style scoped lang="scss">
#cvs {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}
</style>
