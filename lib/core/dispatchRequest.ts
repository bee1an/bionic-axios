import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'
import { createError, ErrorCodes } from './AxiosError'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  return xhr(config)
}

/**
 * Create a new XMLHttpRequest, and send a network request.
 */
function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method, url, data, headers } = config

    const xhr = new XMLHttpRequest()
    xhr.open(method || 'get', url!, true)

    xhr.onreadystatechange = function handleLoad() {
      if (xhr.readyState !== 4 || xhr.status === 0) {
        return
      }

      const response: AxiosResponse = {
        data: xhr.response,
        status: xhr.status,
        statusText: xhr.statusText,
        headers,
        config,
        request: xhr,
      }

      settle(resolve, reject, response)
    }

    xhr.onerror = function handleError() {
      reject(createError('Network Error', config, 'ERR_NETWORK', xhr))
    }

    xhr.send(data as any)
  })
}

function settle(resolve: (value: AxiosResponse) => void, reject: (reason: any) => void, response: AxiosResponse): void {
  const validateStatus = response.config.validateStatus

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  }
  else {
    reject(createError(
      `Request failed with status code ${response.status}`,
      response.config,

      /**
       * 状态小于500的错误和状态大于等于500的错误
       */

      [ErrorCodes.ERR_BAD_REQUEST, ErrorCodes.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4].value,
      response.request,
      response,
    ))
  }
}
