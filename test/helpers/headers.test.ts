import { describe, expect, it } from 'vitest'
import { normalizeHeaderName, plattenHeaders, processHeaders } from '@/helpers'

describe('headers', () => {
  describe('plattenHeaders', () => {
    it('should platten headers', () => {
      const headers = {
        common: {
          a: 1,
          b: 2,
        },
        get: {
          c: 3,
        },
        d: 4,
      }

      expect(plattenHeaders(headers, 'get')).toMatchInlineSnapshot(`
          {
            "a": 1,
            "b": 2,
            "c": 3,
            "d": 4,
          }
        `)

      expect(plattenHeaders(void 0, 'post')).toMatchInlineSnapshot(`undefined`)
    })
  })

  describe('processHeaders', () => {
    it('should process headers', () => {
      const headers = {}

      processHeaders(headers, {})

      expect(headers).toMatchInlineSnapshot(`
        {
          "Content-Type": "application/json;charset=utf-8",
        }
      `)
    })
  })

  describe('normalizeHeaderName', () => {
    it('should normalize header name', () => {
      const headers = {
        'content-type': 'application/json',
      }

      normalizeHeaderName(headers, 'Content-Type')

      expect(headers).toMatchInlineSnapshot(`
        {
          "Content-Type": "application/json",
        }
      `)
    })
  })
})
