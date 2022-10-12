import { defineStore } from 'pinia'

interface IUserInfo {
  sessionToken: string
}

export const useUser = defineStore('user', {
  state(): IUserInfo {
    return {
      sessionToken: ''
    }
  }
})
