import type { AxiosRequestConfig, CancelError as ICancelError } from '@/types'
import AxiosError from '@/core/AxiosError'

export default class CancelError extends AxiosError implements ICancelError {
  __CANCEL__: boolean = true

  constructor(message: string, config?: AxiosRequestConfig, request?: XMLHttpRequest) {
    super(message, 'ERR_CANCELED', config ?? {}, request)
  }
}
