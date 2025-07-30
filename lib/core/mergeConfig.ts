import type { AxiosRequestConfig } from '@/types'
import { deepMerge, isPlainObject } from '@/helpers'

type stratFn = (config1: unknown, config2?: unknown) => any

/**
 * 默认策略
 */
const defaultStrat: stratFn = (config1, config2) => config2 ?? config1

/**
 * 使用配置2
 */
const fromConfig2Strat: stratFn = (_, config2) => config2 ?? void 0

/**
 * 深度合并
 */
const deepMergeStrat: stratFn = (config1, config2) => {
  if (isPlainObject(config2)) {
    return deepMerge(config1, config2)
  }

  if (config2) {
    return config2
  }

  if (isPlainObject(config1)) {
    return deepMerge(config1)
  }

  if (config1) {
    return config1
  }
}

const stratMap = new Map<string, stratFn>([
  ['url', fromConfig2Strat],
  ['method', fromConfig2Strat],
  ['data', fromConfig2Strat],
  ['headers', deepMergeStrat],
  ['auth', deepMergeStrat],
])

/**
 * 合并配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const result = Object.create(null)

  const mergeField = (field: string): void => {
    const stratFn = stratMap.get(field) || defaultStrat

    result[field] = stratFn(config1[field], config2[field])
  }

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  return result
}
