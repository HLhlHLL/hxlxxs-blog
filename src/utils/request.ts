import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class HttpRequest {
  baseURL: string
  timeout: number
  queue: {
    [index: string]: boolean
  }
  constructor() {
    this.baseURL =
      import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_APP_BASE_API
        : ''
    this.timeout = 3000
    // 正在进行请求的请求列表
    this.queue = {}
  }

  setInterceptors(instance: AxiosInstance, url: string) {
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      if (url.indexOf('/api') !== -1) {
        const sessionToken = sessionStorage.getItem('sessionToken') || ''
        config.headers = {
          'X-LC-Key': 'RFBWcqFa7fVJ9aqCgm5LMHgc',
          'X-LC-Id': 'nXKlkQiv7agkND5Hw7SknC3s-gzGzoHsz',
          'Content-Type': 'application/json',
          'X-LC-Session': sessionToken
        }
      }

      if (!Object.keys(this.queue).length) {
        // 此处开启 loading
      }
      this.queue[url] = true
      // 设置取消请求(将 controller 保存到全局，一旦调用就可以取消请求)
      const controller = new AbortController()
      config.signal = controller.signal
      return config
    })

    instance.interceptors.response.use(
      (res) => {
        // 一旦成功就从队列中删除该请求的标记
        delete this.queue[url]
        if (Object.keys(this.queue).length) {
          // 此处关闭 loading
        }
        return res
      },
      (error) => {
        // 一旦成功就从队列中删除该请求的标记
        delete this.queue[url]
        if (Object.keys(this.queue).length) {
          // 此处关闭 loading
        }
        return Promise.reject(error)
      }
    )
  }

  request(config: AxiosRequestConfig) {
    const instance = axios.create()
    config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...config
    }
    this.setInterceptors(instance, config.url as string)
    return instance(config)
  }

  get(url: string, data?: any) {
    return this.request({
      url,
      method: 'GET',
      ...data
    })
  }

  post(url: string, data: any) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }

  put(url: string, data: any) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }

  delete(url: string, data: any) {
    return this.request({
      url,
      method: 'DELETE',
      ...data
    })
  }
}

export default new HttpRequest()
