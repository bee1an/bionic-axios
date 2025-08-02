import type { CancelExecutor, CancelSourceResult, CancelToken as ICancelToken } from '@/types'

export default class CancelToken implements ICancelToken {
  promise: Promise<any>
  reason?: any

  constructor(executor: CancelExecutor) {
    const { promise, resolve } = Promise.withResolvers<void>()

    this.promise = promise

    executor((message?: string) => {
      if (this.reason)
        return
      this.reason = message
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
      throw this.reason // TODO
  }
}
