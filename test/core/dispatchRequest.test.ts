import { describe, expect, it } from 'vitest'
import { transformURL } from '@/core/transformURL'

describe('dispatchRequest', () => {
  describe('transformURL', () => {
    it('should not transform url', () => {
      const config = {
        baseURL: 'https://www.baidu.com/',
        url: 'https://www.baidu.com/user/login',
      }

      expect(transformURL(config)).toMatchInlineSnapshot(`"https://www.baidu.com/user/login"`)
    })

    it('should transform url', () => {
      const config = {
        baseURL: 'https://www.baidu.com/',
        url: '/user/login',
      }

      expect(transformURL(config)).toMatchInlineSnapshot(`"https://www.baidu.com/user/login"`)
    })

    it('should transform url with paramsSerializer', () => {
      const config = {
        baseURL: 'https://www.baidu.com/',
        url: '/user/login',
        params: {
          a: 1,
          b: 2,
        },
        paramsSerializer: (params) => {
          return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')
        },
      }

      expect(transformURL(config)).toMatchInlineSnapshot(`"https://www.baidu.com/user/login?a=1&b=2"`)
    })

    it('should transform url with searchParams', () => {
      const params = new URLSearchParams()

      params.append('a', '1')
      params.append('b', '2')

      const config = {
        baseURL: 'https://www.baidu.com/',
        url: '/user/login',
        params,
      }

      expect(transformURL(config)).toMatchInlineSnapshot(`"https://www.baidu.com/user/login?a=1&b=2"`)
    })

    it('should transform url with par', () => {
      const params = {
        a: ['1', '2'],
        b: new Date(1234567890123),
        c: {
          d: 1,
        },
      }

      const config = {
        baseURL: 'https://www.baidu.com/',
        url: '/user/login',
        params,
      }

      expect(transformURL(config)).toMatchInlineSnapshot(`"https://www.baidu.com/user/login?a[]=1&a[]=2&b=2009-02-13T23:31:30.123Z&c=%7B%22d%22:1%7D"`)
    })
  })
})
