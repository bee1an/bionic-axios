import type { AxiosPromise, AxiosRequestConfig } from '@/types'
import { kindof } from '@/helpers'

// eslint-disable-next-line node/prefer-global/process
const isHttpSupported = typeof process !== 'undefined' && kindof(process) === 'process'

export default isHttpSupported && function (_: AxiosRequestConfig): AxiosPromise {
  return new Promise(() => {
    // TODO
  })
}
