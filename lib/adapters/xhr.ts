import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'
import CancelError from '@/cancel/CancelError'
import { createError } from '@/core/AxiosError'
import { settle } from '@/core/settle'
import { isFormData, parseHeaders } from '@/helpers'

const isXHRSupported = typeof XMLHttpRequest !== 'undefined'

/**
 * Create a new XMLHttpRequest, and send a network request.
 */
export default isXHRSupported && function (config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method, url, data, cancelToken, signal, headers } = config

    const xhr = new XMLHttpRequest()
    xhr.open(method || 'get', url!, true)

    xhr.onreadystatechange = function handleLoad() {
      if (xhr.readyState !== 4 || xhr.status === 0) {
        return
      }

      const responseHeaders = xhr.getAllResponseHeaders()

      const response: AxiosResponse = {
        data: xhr.response,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(responseHeaders),
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
        reject(new CancelError(reason ?? 'Canceled', config, xhr))
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

    if (isFormData(data)) {
      delete headers!['Content-Type']
    }

    Object.keys(headers!).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type')
        delete headers![name]
      else
        xhr.setRequestHeader(name, headers![name])
    })
  })
}
