import type { AxiosRequestConfig, AxiosResponse, AxiosTransformer } from '@/types'
import defaults from '@/defaults'

export default function transformData(this: AxiosRequestConfig, fns: AxiosTransformer[], response?: AxiosResponse): any {
  const config = this || defaults
  const context = response || config
  const { headers } = config

  let { data } = context

  fns.forEach((fn) => {
    data = fn.call(config, data, headers!, response?.status)
  })
}
