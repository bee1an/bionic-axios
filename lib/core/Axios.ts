import type { AxiosPromise, AxiosRequestConfig, Axios as IAxios } from '@/types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import mergeConfig from './mergeConfig'

export default class Axios implements IAxios {
  default: AxiosRequestConfig

  constructor(config: AxiosRequestConfig) {
    this.default = config
  }

  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): AxiosPromise {
    if (typeof url === 'string') {
      config.url = url
    }
    else {
      config = url
    }

    config = mergeConfig(this.default, config)

    // 将请求派遣给具体的请求方法
    return dispatchRequest(config)
  }

  getUri(config?: AxiosRequestConfig): string {
    return transformURL(mergeConfig(this.default, config))
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'delete' })
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'get' })
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'head' })
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'options' })
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'post', data })
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'put', data })
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'patch', data })
  }

  postForm(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'post', data, headers: { 'Content-Type': 'multipart/form-data' } })
  }

  putForm(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'put', data, headers: { 'Content-Type': 'multipart/form-data' } })
  }

  patchForm(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(url, { ...config, method: 'patch', data, headers: { 'Content-Type': 'multipart/form-data' } })
  }
}
