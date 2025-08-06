import type { AxiosPromise, AxiosRequestConfig } from '@/types'
import adapters from '@/adapters'
import { isArray, plattenHeaders } from '@/helpers'
import transformData from './transformData'
import { transformURL } from './transformURL'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  if (config.cancelToken)
    config.cancelToken.throwIfRequested()

  processConfig(config)

  return adapters.getAdapter(config.adapter!)(config).then(
    (response) => {
      response.data = transformData.call(
        config,
        isArray(config.transformRequest) ? config.transformRequest : [config.transformRequest!],
        response,
      )

      return response
    },
  )
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformData.call(
    config,
    isArray(config.transformRequest) ? config.transformRequest : [config.transformRequest!],
  )
  config.headers = plattenHeaders(config.headers, config.method!)
}
