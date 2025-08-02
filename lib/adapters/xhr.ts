import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'
import { createError } from '@/core/AxiosError'
import { settle } from '@/core/settle'

const isXHRSupported = typeof XMLHttpRequest !== 'undefined'

/**
 * Create a new XMLHttpRequest, and send a network request.
 */
export default isXHRSupported && function (config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method, url, data, headers, cancelToken, signal } = config

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

    if (cancelToken || signal) {
      const onCancel = (reason?: string): void => {
        xhr.abort()
        reject(createError(reason ?? 'Canceled', config, 'ERR_CANCELED', xhr))
      }

      if (cancelToken) {
        cancelToken.promise.then(onCancel)
      }

      if (signal) {
        if (signal.aborted) {
          onCancel()
          return
        }

        signal.addEventListener('abort', () => {
          onCancel()
        })
      }
    }
  })
}
