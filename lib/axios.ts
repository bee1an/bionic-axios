import type { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const axios = new Axios(config)
  return axios
}

/**
 * axios预设实例
 */
export const axios = createInstance({
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  },
})
