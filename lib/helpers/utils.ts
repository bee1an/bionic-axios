import { isArray, isObject, isPlainObject, isUndefined } from './is'

type VisitResult<T> = T | Record<string | number, any> | undefined

/**
 * 将对象递归转换为 JSON 对象。
 *
 * 这个函数将对象递归地遍历,并将其转换为 JSON 对象。
 * 如果对象包含循环引用,则停止遍历
 * 会过滤undefined
 * 如果对象中含有 toJSON 方法，则不会拷贝
 */
export function toJSONObject<T = object>(obj: T): VisitResult<T> {
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
  return visit(obj, 0)
}

/**
 * 通过toString.call获取数据的类型
 *
 * 但是如果通过Symbol.toStringTag修改, 那么这个方法会不准
 */
export const kindof = (cache => (thing: unknown) => {
  const str = toString.call(thing)
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
})(Object.create(null))

/**
 * 获取对象的原型
 */
export const getPrototypeOf = Object.getPrototypeOf

/**
 * 递归合并对象
 */
export function deepMerge(...args: any[]): object {
  const result = Object.create(null)

  const assignValue = (value: unknown, key: string): void => {
    if (isPlainObject(result[key]) && isPlainObject(value)) {
      result[key] = deepMerge(result[key], value)
    }

    else if (isPlainObject(value)) {
      result[key] = deepMerge({}, value)
    }

    else {
      result[key] = value
    }
  }

  for (let i = 0; i < args.length; i++) {
    const object = args[i]
    for (const key in object) {
      assignValue(object[key], key)
    }
  }
  return result
}
