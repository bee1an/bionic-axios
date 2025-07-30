import { isArray, isFunction, isObject, isUndefined } from './is'

export { isArray, isFunction, isObject, isUndefined }

type VisitResult<T> = T | Record<string | number, any> | undefined

export function toJSONObject<T = object>(obj: T): T | Record<string | number, any> {
  const stack = Array.from({ length: 10 })

  const visit = (source: T, i: number): VisitResult<T> => {
    if (isObject(source)) {
      if (stack.includes(source))
        return

      if (!('toJSON' in source)) {
        stack[i] = source
        const target: Record<string | number, any> = isArray(source) ? [] : {}
        for (const key in source) {
          const value = (source as Record<string, any>)[key]

          const reducedValue = visit(value, i + 1)
          !isUndefined(reducedValue) && (target[key] = reducedValue)
        }
        stack[i] = void 0
        return target
      }
    }

    return source
  }
  return visit(obj, 0) as NonNullable<VisitResult<T>>
}
