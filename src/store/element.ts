import { defineStore } from 'pinia'

export const useElementStore = defineStore('element', {
  state() {
    return {
      offsetTop: 0
    }
  }
})
