<script setup lang="ts">
type PropsData = {
  modelValue: boolean
  title?: string
  content?: string
  cancelButtonText?: string
  confirmButtonText?: string
}
const props = withDefaults(defineProps<PropsData>(), {
  modelValue: false,
  title: 'message box',
  content: 'this is some message',
  cancelButtonText: 'cancel',
  confirmButtonText: 'confirm'
})
const emit = defineEmits(['update:modelValue', 'handleCancel', 'handleConfirm'])

const handleCancel = () => {
  emit('handleCancel')
  emit('update:modelValue', !props.modelValue)
}
const handleConfirm = () => {
  emit('handleConfirm')
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <Teleport to="body">
    <transition>
      <div class="message-box" v-show="props.modelValue">
        <div class="message-box-inner">
          <div class="title">
            <span>{{ props.title }}</span>
          </div>
          <div class="content">
            <span>{{ props.content }}</span>
          </div>
          <div class="footer">
            <button class="cancel" @click="handleCancel">
              {{ props.cancelButtonText }}
            </button>
            <button class="confirm" @click="handleConfirm">
              {{ props.confirmButtonText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.message-box {
  position: fixed;
  inset: 0;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 2;
  .message-box-inner {
    width: 400px;
    margin: 200px auto;
    padding-bottom: 15px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 2px 2px 3px #333;
    .title {
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      border-bottom: 1px solid #999;
      user-select: none;
    }
    .content {
      padding: 15px 30px;
      box-sizing: border-box;
    }
    .footer {
      margin-top: 10px;
      text-align: center;
      button {
        margin: 0 10px;
        padding: 4px 8px;
        border: 1px solid #222;
        border-radius: 5px;
        background-color: #fff;
        color: #222;
        font-size: 16px;
        transition: all 0.2s linear;
        cursor: pointer;
        &:hover {
          background-color: #222;
          color: #fff;
        }
      }
      .cancel {
        color: #fff;
        background-color: #222;
        &:hover {
          color: #222;
          background-color: #fff;
        }
      }
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
