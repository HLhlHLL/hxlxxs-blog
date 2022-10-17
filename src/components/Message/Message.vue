<script setup lang="ts">
import { ref } from 'vue'
type PropsData = {
  message: string
  type: string
  destroyFn: () => void
}

const props = withDefaults(defineProps<PropsData>(), {
  type: 'default'
})

const messageBoxRef = ref<HTMLElement | null>(null)

let timer1 = setTimeout(() => {
  if (messageBoxRef.value) {
    messageBoxRef.value.style.top = '-100px'
    messageBoxRef.value.style.opacity = '0'
  }
  clearTimeout(timer1)
}, 3000)
let timer2 = setTimeout(() => {
  props.destroyFn()
  clearTimeout(timer2)
}, 3500)
</script>

<template>
  <div class="message-box" ref="messageBoxRef">
    <div :class="['message', props.type]">
      <span class="content">{{ props.message }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-box {
  position: fixed;
  top: 40px;
  left: 50%;
  text-align: center;
  border-radius: 5px;
  transform: translateX(-50%);
  overflow: hidden;
  transition: top 0.3s ease-in, opacity 0.2s linear;
  animation: show 0.3s ease-out;
  z-index: 99;
  .message {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
  }
  .default {
    color: #222;
    border: 1px solid #e6e6e6;
    background-color: #fff;
  }
  .primary {
    color: #fff;
    background-color: #409eff;
  }
  .success {
    color: #fff;
    background-color: #67c23a;
  }
  .info {
    color: #fff;
    background-color: #909399;
  }
  .warning {
    color: #fff;
    background-color: #e6a23c;
  }
  .danger {
    color: #fff;
    background-color: #f56c6c;
  }
}

@keyframes show {
  from {
    top: 0;
    opacity: 0;
  }
  to {
    top: 40px;
    opacity: 1;
  }
}
</style>
