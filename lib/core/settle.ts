import type { AxiosResponse } from '@/types'
import { createError, ErrorCodes } from './AxiosError'

export function settle(resolve: (value: AxiosResponse) => void, reject: (reason: any) => void, response: AxiosResponse): void {
  const validateStatus = response.config.validateStatus

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  }
  else {
    reject(createError(
      `Request failed with status code ${response.status}`,
      response.config,

      /**
       * 状态小于500的错误和状态大于等于500的错误
       */

      [ErrorCodes.ERR_BAD_REQUEST, ErrorCodes.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4].value,
      response.request,
      response,
    ))
  }
}
