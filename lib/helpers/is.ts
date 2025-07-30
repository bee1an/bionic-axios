// eslint-disable-next-line valid-typeof
const typeofTest = (type: string) => (thing: unknown) => typeof thing === type

// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = typeofTest('function') as (thing: unknown) => thing is Function

export const isObject = (thing: unknown): thing is object => thing !== null && typeofTest('object')(thing)

export const isArray = <T = unknown>(thing: unknown): thing is T[] => Array.isArray(thing)

export const isUndefined = typeofTest('undefined') as (thing: unknown) => thing is undefined
