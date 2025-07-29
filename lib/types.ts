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

/**
 * axios抽象接口
 */
export interface Axios {
  /**
   * 默认请求配置
   */
  default: AxiosRequestConfig

  /**
   * 请求发送函数
   */
  request: <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>
}

/**
 * axios实例
 */
export interface AxiosInstance extends Axios {}
