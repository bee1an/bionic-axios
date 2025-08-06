import type { AxiosPromise, AxiosRequestConfig } from '@/types'
import { isFunction } from '@/helpers'
import fetch from './fetch'
import http from './http'
import xhr from './xhr'

const adapters = {
  xhr,
  http,
  fetch,
}

export default {
  getAdapter(adapter: NonNullable<AxiosRequestConfig['adapter']>): (config: AxiosRequestConfig) => AxiosPromise {
    if (isFunction(adapter)) {
      return adapter
    }

    else {
      const concreteAdapter = adapters[adapter.toLowerCase()]

      if (!concreteAdapter) {
        throw new Error(`Adapter ${adapter} is not supported`)
      }

      return concreteAdapter
    }
  },
}
