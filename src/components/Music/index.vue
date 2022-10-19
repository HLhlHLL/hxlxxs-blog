<script setup lang="ts">
import gsap from 'gsap'

window.addEventListener('scroll', function () {
  if (window.scrollY >= 300) {
    gsap.to('.music', {
      bottom: 0,
      duration: 0.5,
      ease: 'power1.out',
      opacity: 1
    })
  } else {
    gsap.to('.music', {
      bottom: -110,
      duration: 0.5,
      ease: 'power1.in',
      opacity: 0
    })
  }
})
</script>

<template>
  <div class="music">
    <iframe
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="330"
      height="100"
      src="//music.163.com/outchain/player?type=0&id=6831180679&auto=1&height=90"
    ></iframe>
  </div>
</template>

<style scoped lang="scss">
.music {
  position: fixed;
  bottom: -110px;
  left: 0;
  opacity: 0;
  z-index: 2;
}
</style>
