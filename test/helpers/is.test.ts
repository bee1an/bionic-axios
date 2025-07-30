import { describe, expect, it } from 'vitest'
import { isPlainObject } from '@/helpers'

describe('is', () => {
  describe('isPlainObject', () => {
    it('should is a plain object', () => {
      expect(isPlainObject({})).toMatchInlineSnapshot(`true`)
      expect(isPlainObject(new Object())).toMatchInlineSnapshot(`true`)
      expect(isPlainObject(Object.create(null))).toMatchInlineSnapshot(`true`)
    })

    it('should is not a plain object', () => {
      expect(isPlainObject([])).toMatchInlineSnapshot(`false`)
      expect(isPlainObject(new Date())).toMatchInlineSnapshot(`false`)

      class C {};
      expect(isPlainObject(new C())).toMatchInlineSnapshot(`false`)
    })
  })
})
