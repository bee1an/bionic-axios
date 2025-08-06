import { cookie } from './cookie'

import {
  normalizeHeaderName,
  parseHeaders,
  plattenHeaders,
  processHeaders,
} from './headers'

import {
  isArray,
  isDate,
  isFormData,
  isFunction,
  isObject,
  isPlainObject,
  isUndefined,
  isURLSomeOrigin,
} from './is'

import { transformRequest, transformResponse } from
  './transform'

import {
  encode,
  isAbsoluteURL,
  isSearchParams,
} from './url'

import {
  deepMerge,
  getPrototypeOf,
  kindof,
  toJSONObject,
} from './utils'

export {
  cookie,
  deepMerge,
  encode,
  getPrototypeOf,
  isAbsoluteURL,
  isArray,
  isDate,
  isFormData,
  isFunction,
  isObject,
  isPlainObject,
  isSearchParams,
  isUndefined,
  isURLSomeOrigin,
  kindof,
  normalizeHeaderName,
  parseHeaders,
  plattenHeaders,
  processHeaders,
  toJSONObject,
  transformRequest,
  transformResponse,
}
