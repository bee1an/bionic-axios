import type { AxiosRequestConfig, CancelExecutor, CancelSourceResult, CancelToken as ICancelToken } from '@/types'
import CancelError from './CancelError'

export default class CancelToken implements ICancelToken {
  promise: Promise<any>
  reason?: CancelError

  constructor(executor: CancelExecutor) {
    const { promise, resolve } = Promise.withResolvers<void>()

    this.promise = promise

    executor((message?: string, config?: AxiosRequestConfig, request?: XMLHttpRequest) => {
      if (this.reason)
        return
      this.reason = new CancelError(message ?? 'Canceled', config, request)
      resolve()
    })
  }

  source(): CancelSourceResult {
    let cancel
    const token = new CancelToken((c) => {
      cancel = c
    })
    return {
      token,
      cancel,
    }
  }

  throwIfRequested(): void {
    if (this.reason)
      throw this.reason
  }
}
