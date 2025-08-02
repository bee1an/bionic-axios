import type { AxiosRequestConfig, AxiosStatic, Axios as IAxios, CancelToken as ICancelToken } from './types'
import { CancelToken } from './cancel'
import Axios from './core/Axios'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const axios = new Axios(config)

  const instance = Object.assign(Axios.prototype.request.bind(axios), axios, {
    create(config: AxiosRequestConfig) {
      return createInstance(config)
    },
    Axios: Axios as unknown as IAxios,
    all<T>(values: (T | Promise<T>)[]) {
      return Promise.all(values)
    },
    spread<T, R>(callback: (...args: T[]) => R) {
      return (array: T[]) => callback(...array)
    },
    CancelToken: CancelToken as unknown as ICancelToken,
  })

  return instance
}

/**
 * axios预设实例
 */
export const axios = createInstance(defaults)
