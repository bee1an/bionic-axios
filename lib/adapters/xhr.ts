import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'
import CancelError from '@/cancel/CancelError'
import { createError } from '@/core/AxiosError'
import { settle } from '@/core/settle'
import { cookie, isFormData, isURLSomeOrigin, parseHeaders } from '@/helpers'

const isXHRSupported = typeof XMLHttpRequest !== 'undefined'

/**
 * Create a new XMLHttpRequest, and send a network request.
 */
export default isXHRSupported && function (config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      method,
      url,
      data,
    } = config

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

    beforeSend(config, xhr, reject)

    xhr.send(data as any)
  })
}

function beforeSend(config: AxiosRequestConfig, xhr: XMLHttpRequest, reject: (reason: any) => void): void {
  const {
    url,
    data,
    cancelToken,
    signal,
    headers,
    withCredentials,
    xsrfCookieName,
    xsrfHeaderName,
    auth,
  } = config

  const onCancel = (reason?: string): void => {
    xhr.abort()
    reject(new CancelError(reason ?? 'Canceled', config, xhr))
  }

  if (cancelToken || signal) {
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

  if (withCredentials) {
    xhr.withCredentials = withCredentials
  }

  if ((withCredentials || isURLSomeOrigin(url!)) && xsrfCookieName) {
    const xsrfCookie = cookie.read(xsrfCookieName)

    if (xsrfCookie && xsrfHeaderName) {
      xhr.setRequestHeader(xsrfHeaderName, xsrfCookie)
    }
  }

  if (auth) {
    headers!.Authorization = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
  }

  registerEvent(config, xhr)
}

function registerEvent(config: AxiosRequestConfig, xhr: XMLHttpRequest): void {
  const {
    onDownloadProgress,
    onUploadProgress,
  } = config

  if (onDownloadProgress) {
    xhr.onprogress = onDownloadProgress
  }

  if (onUploadProgress) {
    xhr.upload.onprogress = onUploadProgress
  }
}
