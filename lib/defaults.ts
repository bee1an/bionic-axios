import type { AxiosRequestConfig } from './types'

export default {
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  },
} as AxiosRequestConfig
