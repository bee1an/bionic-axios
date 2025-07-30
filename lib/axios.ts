import type { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const axios = new Axios(config)
  return axios
}

/**
 * axios预设实例
 */
export const axios = createInstance(defaults)
