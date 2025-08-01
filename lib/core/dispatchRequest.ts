import type { AxiosPromise, AxiosRequestConfig, AxiosResponse, IHeaders, Methods } from '@/types'
import { deepMerge, encode, isAbsoluteURL, isDate, isPlainObject, isSearchParams } from '@/helpers'
import { createError, ErrorCodes } from './AxiosError'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  return xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = plattenHeaders(config.headers, config.method!)
}

/**
 * Transforms the provided URL by combining the baseURL and the relative url.
 */
export function transformURL(config: AxiosRequestConfig): string {
  const { baseURL, url, params, paramsSerializer } = config

  if (!baseURL || isAbsoluteURL(url!))
    return url!

  let fullURL = [baseURL?.replace(/\/$/, ''), url?.replace(/^\//, '')].join('/')

  if (!params)
    return fullURL

  let paramsString = ''

  if (paramsSerializer) {
    paramsString = paramsSerializer(params)
  }

  else if (isSearchParams(params)) {
    paramsString = params.toString()
  }

  else {
    const parts: string[] = []

    Object.keys(params).forEach((key) => {
      const value = params[key]

      if (value === null || value === void 0)
        return

      let values: any[]

      if (Array.isArray(value)) {
        key = `${key}[]`
        values = value
      }
      else {
        values = [value]
      }

      values.forEach((val) => {
        if (isDate(val)) {
          val = val.toISOString()
        }
        else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }

        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    paramsString = parts.join('&')
  }

  if (paramsString) {
    // 排除 hash
    const marIndex = fullURL.indexOf('#')
    if (marIndex !== -1) {
      fullURL = fullURL.slice(0, marIndex)
    }

    fullURL += (fullURL.includes('?') ? '&' : '?') + paramsString
  }

  return fullURL
}

/**
 * 将 headers 中的 common 和 method 两个配置合并并去除 common 和 method
 */
export function plattenHeaders(headers: IHeaders | undefined, method: Methods): IHeaders | undefined {
  if (!headers)
    return headers

  headers = deepMerge(headers.common, headers[method.toLowerCase()], headers)

  ;[
    'delete',
    'get',
    'head',
    'post',
    'put',
    'patch',
    'common',
  ].forEach((method) => {
    delete headers![method]
  })

  return headers
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
