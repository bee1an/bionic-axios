import type { AxiosErrorCode, AxiosRequestConfig, AxiosResponse, AxiosError as IAxiosError } from '@/types'
import { isFunction, toJSONObject } from '@/helpers'

interface AxiosErrorToJSON {
  message: string
  name: string
  stack?: string
  code: AxiosErrorCode | null
  status?: number | null
  config: Record<string | number, any> | AxiosRequestConfig | undefined
}

export default class AxiosError extends Error implements IAxiosError {
  isAxiosError = true

  constructor(
    message: string,
    public code: AxiosErrorCode | null,
    public config: AxiosRequestConfig,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse,
  ) {
    super(message)

    /*
      修改调用栈信息
      隐藏冗余的调用栈信息
      低版本浏览器不支持Error.captureStackTrace
    */
    if (isFunction(Error.captureStackTrace))
      Error.captureStackTrace(this, this.constructor)
    else
      this.stack = (new Error(message)).stack
    /*
      ai:
      早期 class 继承有遗留问题
      调用 super(message) 会创建一个新的 Error 实例，
      但这个实例的 prototype 实际上是 Error 的，而不是子类的 AxiosError,
    */
    Object.setPrototypeOf(this, AxiosError.prototype)
  }

  /**
   * 转换实例为 JSON 对象
   */
  toJSON(): AxiosErrorToJSON {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      code: this.code,
      status: this.response?.status ?? null,
      config: toJSONObject(this.config),
    }
  }
}

const errorCodes = [
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL',
] as const

const descriptors: Record<typeof errorCodes[number], { value: AxiosErrorCode }> = {} as any

errorCodes.reduce((acc, code) => {
  acc[code] = { value: code }
  return acc
}, descriptors)

Object.defineProperties(AxiosError, descriptors)

export { descriptors as ErrorCodes }

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code: AxiosErrorCode | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse,
): AxiosError {
  return new AxiosError (message, code, config, request, response)
}
