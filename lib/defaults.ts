import type { AxiosRequestConfig } from './types'
import { processHeaders, transformRequest, transformResponse } from './helpers'

export default {
  method: 'get',
  adapter: 'xhr',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function (data: any, headers): any {
      processHeaders(headers, data)
      data = transformRequest(data)
      return data
    },
  ],
  transformResponse: [
    function (data: any): any {
      data = transformResponse(data)
      return data
    },
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  },
} as AxiosRequestConfig
