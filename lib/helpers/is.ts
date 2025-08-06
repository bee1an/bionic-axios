import { getPrototypeOf, kindof } from './utils'

// eslint-disable-next-line valid-typeof
const typeofTest = (type: string) => (thing: unknown) => typeof thing === type

// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = typeofTest('function') as (thing: unknown) => thing is Function

export const isObject = (thing: unknown): thing is object => thing !== null && typeofTest('object')(thing)

export const isArray = <T = unknown>(thing: unknown): thing is T[] => Array.isArray(thing)

export const isUndefined = typeofTest('undefined') as (thing: unknown) => thing is undefined

/**
 * 判断一个对象是否是纯对象
 */
export function isPlainObject(thing: unknown): thing is Record<string, unknown> {
  if (kindof(thing) !== 'object')
    return false

  const prototype = getPrototypeOf(thing)
  return (
    prototype === null
    || prototype === Object.prototype
    || Object.getPrototypeOf(prototype) === null
  )
  && !(Symbol.toStringTag in (thing as object))
  && !(Symbol.iterator in (thing as object))
}

export const isDate = (thing: unknown): thing is Date => kindof(thing) === 'date'

export const isFormData = (thing: unknown): thing is FormData => thing instanceof FormData

export function isURLSomeOrigin(thing: string): boolean {
  const a = document.createElement('a')
  a.href = thing

  const { origin } = a

  return origin === window.location.origin
}
