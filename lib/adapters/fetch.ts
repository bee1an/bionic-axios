import type { AxiosPromise, AxiosRequestConfig } from '@/types'

const isFetchSupported = typeof fetch !== 'undefined'

export default isFetchSupported && function (_: AxiosRequestConfig): AxiosPromise {
  return new Promise(() => {
    // TODO
  })
}
