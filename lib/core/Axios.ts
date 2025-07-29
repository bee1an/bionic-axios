import type { AxiosPromise, AxiosRequestConfig, Axios as IAxios } from '@/types'
import dispatchRequest from './dispatchRequest'

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

    // 将请求派遣给具体的请求方法
    return dispatchRequest({ ...this.default, ...config })
  }
}
