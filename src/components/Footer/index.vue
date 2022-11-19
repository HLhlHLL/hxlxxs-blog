<script setup lang="ts">
import { Directive, DirectiveBinding } from 'vue'
const vBounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const words = binding.value.split('')
    for (let i = 0; i < words.length; i++) {
      const liEl = document.createElement('li')
      liEl.innerText = words[i]
      liEl.style.cssText = `
      --index: ${i};
      animation: bounce 0.8s ease-out infinite alternate;
      animation-delay: calc(var(--index) * 0.2s);
      vertical-align: middle;
    `
      liEl.className = 'bounce-word'
      el.appendChild(liEl)
    }
  }
}
</script>

<template>
  <div class="footer">
    <ul class="animate-text" v-bounce="'hxlxx.xyz'"></ul>
    <div class="copyright">copyright © www.hxlxx.xyz</div>
    <div class="beian">
      <img src="@/assets/images/gongan.png" alt="" />
      <a
        href="https://beian.miit.gov.cn/?token=d5e05fcb-d5ee-49b0-bfcb-414ac175a885"
        target="_blank"
        >蜀ICP备2022027456号</a
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 200px;
  .animate-text {
    display: flex;
    gap: 2px;
    align-items: center;
    margin: 0;
    padding: 0;
    font-size: 20px;
    font-weight: 600;
    list-style: none;
    transform: skew(-15deg);
    color: #fff;
    text-shadow: 1px 1px 0 #222, 1.5px 1.5px 0 #222, 2px 2px 0 #222,
      2.5px 2.5px 0 #222, 3px 3px 0 #222;
  }
  .beian {
    display: flex;
    align-items: center;
  }
}
</style>
