import type { InterceptorManager as IInterceptorManager, Interceptor, RejectedFn, ResolvedFn } from '@/types'

export default class InterceptorManager<T> implements IInterceptorManager<T> {
  private _interceptors: (Interceptor<T> | null)[] = []

  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this._interceptors.push({
      resolved,
      rejected,
    })
    return this._interceptors.length - 1
  }

  eject(id: number): void {
    if (this._interceptors[id]) {
      this._interceptors[id] = null
    }
  }

  forEach(
    cb: (cur: Interceptor<T>, index: number, arr: (Interceptor<T> | null)[]) => void,
  ): void {
    this._interceptors.forEach(
      (interceptor, index, arr) => interceptor && cb(interceptor, index, arr),
    )
  }
}
