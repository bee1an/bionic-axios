import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types'

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
      reject(new Error('Network Error'))
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
    reject(new Error(`Request failed with status code ${response.status}`))
  }
}
