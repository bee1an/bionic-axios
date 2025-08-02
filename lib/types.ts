/**
 * 请求方法总汇
 */
export type Methods
  = 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'

/**
 * 请求参数
 */
export type Params = Record<string, any>

/**
 * 请求头
 */
export type IHeaders = Record<string, any>

/**
 * 请求配置
 */
export interface AxiosRequestConfig {
  /**
   * 请求链接
   */
  url?: string
  /**
   * 请求方法
   */
  method?: Methods
  /**
   * 请求体
   */
  data?: unknown
  /**
   * 请求参数
   */
  params?: Params
  /**
   * 请求头
   */
  headers?: IHeaders
  /**
   * 请求状态码验证函数
   */
  validateStatus?: (status: number) => boolean

  /**
   * 基础 url
   */
  baseURL?: string

  /**
   * 序列化params的函数
   */
  paramsSerializer?: (params: Params) => string

  /**
   * 适配器
   */
  adapter?: 'xhr' | 'fetch' | 'http' | ((config: AxiosRequestConfig) => AxiosPromise)

  /**
   * 取消请求
   */
  cancelToken?: CancelToken
}

/**
 * 响应
 */
export interface AxiosResponse<T = any> {
  /**
   * 数据
   */
  data: T
  /**
   * 状态码
   */
  status: number
  /**
   * 状态信息
   */
  statusText: string
  /**
   * 响应头
   */
  headers?: IHeaders
  /**
   * 请求配置
   */
  config: AxiosRequestConfig
  /**
   * 请求
   */
  request: XMLHttpRequest
}

/**
 * axios统一的promise
 */
export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>

type AxiosWhitoutDataMethods = 'delete' | 'get' | 'head' | 'options'
type AxiosWhitoutData = {
  [key in AxiosWhitoutDataMethods]: (url: string, config?: AxiosRequestConfig) => AxiosPromise
}

type AxiosWithDataMethods = 'post' | 'put' | 'patch' | 'postForm' | 'putForm' | 'patchForm'
type AxiosWithData = {
  [key in AxiosWithDataMethods]: (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise
}

/**
 * axios抽象接口
 */
export interface Axios extends AxiosWhitoutData, AxiosWithData {
  /**
   * 默认请求配置
   */
  default: AxiosRequestConfig

  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  /**
   * 请求发送函数
   */
  request: <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>

  /**
   * 获取请求链接
   */
  getUri: (config?: AxiosRequestConfig) => string
}

export type ResolvedFn<T> = (value: T) => T | Promise<T>

export type RejectedFn = (error: any) => any

export interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected: RejectedFn
}

/**
 * 拦截器
 */
export interface InterceptorManager<T> {
  use: (resolved: ResolvedFn<T>, rejected: RejectedFn) => number
  eject: (id: number) => void
}

/**
 * axios实例
 */
export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>
  <T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>

  create: (config: AxiosRequestConfig) => Axios
}

export interface AxiosStatic extends AxiosInstance {
  Axios: Axios
  all: <T>(values: (T | Promise<T>)[]) => Promise<T[]>
  spread: <T, R>(callback: (...args: T[]) => R) => (array: T[]) => R

  CancelToken: CancelToken
}

export interface CancelSourceResult {
  token: CancelToken
  cancel: Promise<void>
}

export interface CancelExecutor {
  (canceler?: (message?: string) => void): void
}

export interface CancelToken {
  promise: Promise<string>
  reason?: string

  source: () => CancelSourceResult

  throwIfRequested: () => void
}

/**
 * axios错误代码
 */
export type AxiosErrorCode
  = | 'ERR_BAD_OPTION_VALUE' // 无效的选项值
    | 'ERR_BAD_OPTION' // 无效的选项
    | 'ECONNABORTED' // 连接中止
    | 'ETIMEDOUT' // 连接超时
    | 'ERR_NETWORK' // 网络错误
    | 'ERR_FR_TOO_MANY_REDIRECTS' // 重定向次数过多
    | 'ERR_DEPRECATED' // 已废弃
    | 'ERR_BAD_RESPONSE' // 错误的响应
    | 'ERR_BAD_REQUEST' // 错误的请求
    | 'ERR_CANCELED' // 请求取消
    | 'ERR_NOT_SUPPORT' // 不支持
    | 'ERR_INVALID_URL' // 无效的URL

/**
 * axios自定义错误
 */
export interface AxiosError extends Error {
  /**
   * 是否是axios自定义错误
   */
  isAxiosError: boolean

  /**
   * 请求配置
   */
  config: AxiosRequestConfig

  /**
   * 错误信息
   */
  code?: AxiosErrorCode | null

  /**
   * 请求
   */
  request?: XMLHttpRequest

  /**
   * 响应
   */
  response?: AxiosResponse
}
