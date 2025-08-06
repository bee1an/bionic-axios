import type { AxiosRequestConfig } from '@/types'
import { encode, isAbsoluteURL, isDate, isPlainObject, isSearchParams } from '@/helpers'

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
