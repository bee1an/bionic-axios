import type { IHeaders, Methods } from '@/types'
import { isPlainObject } from './is'
import { deepMerge } from './utils'

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
 * 处理 headers
 *
 * 1. Normalize header names
 * 2. If data is a plain object, set Content-Type to `application/json;charset=utf-8`
 */
export function processHeaders(headers: IHeaders, data: any): void {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type'])
      headers['Content-Type'] = 'application/json;charset=utf-8'
  }
}

/**
 * Normalize header names
 */
export function normalizeHeaderName(headers: IHeaders, normalizeName: string): void {
  const upperCaseName = normalizeName.toUpperCase()

  Object.keys(headers).forEach((name) => {
    if (name !== normalizeName && name.toUpperCase() === upperCaseName) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

const ignoreDuplicateOf = new Set([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent',
])

export function parseHeaders(headers: string): IHeaders {
  const parsed = Object.create(null)
  if (!headers)
    return parsed

  headers.split('\n').forEach((line) => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key || (parsed[key] && ignoreDuplicateOf.has(key)))
      return

    const val = vals.join(':').trim()

    if (key === 'set-cookie') {
      if (parsed[key])
        parsed[key].push(val)
      else
        parsed[key] = [val]
    }
    else {
      parsed[key] = parsed[key] ? `${parsed[key]}, ${val}` : val
    }
  })

  return parsed
}
