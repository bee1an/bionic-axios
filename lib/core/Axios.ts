import type { AxiosPromise, AxiosRequestConfig, AxiosResponse, Axios as IAxios, RejectedFn, ResolvedFn } from '@/types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

export default class Axios implements IAxios {
  default: AxiosRequestConfig

  interceptors: { request: InterceptorManager<AxiosRequestConfig>, response: InterceptorManager<AxiosResponse> } = {
    request: new InterceptorManager<AxiosRequestConfig>(),
    response: new InterceptorManager<AxiosResponse>(),
  }

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

    const chain: ({
      resolved: ResolvedFn<any> | ((config: AxiosRequestConfig) => AxiosPromise<any>)
      rejected?: RejectedFn
    })[] = [{
      resolved: dispatchRequest,
      rejected: void 0,
    }]

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor!)
    })
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor!)
    })

    let promise = Promise.resolve(config) as AxiosPromise

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      // promise结果透传
      promise = promise.then(resolved, rejected)
    }

    // 将请求派遣给具体的请求方法
    return promise
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
