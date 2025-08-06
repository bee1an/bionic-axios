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
  kindof,
  normalizeHeaderName,
  parseHeaders,
  plattenHeaders,
  processHeaders,
  toJSONObject,
  transformRequest,
  transformResponse,
}
