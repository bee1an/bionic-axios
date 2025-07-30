import { describe, expect, it } from 'vitest'
import { toJSONObject } from '@/helpers'

describe('helpers index', () => {
  it('should work', () => {
    const obj = {
      a: 1,
      b: 2,
      c: {
        d: 3,
      },
    }

    expect(toJSONObject(obj)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 2,
        "c": {
          "d": 3,
        },
      }
    `)
  })

  it('should ignore undefined', () => {
    const obj = {
      a: 1,
      b: 2,
      c: void 0,
    }

    expect(toJSONObject(obj)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 2,
      }
    `)
  })

  it('should filter toJSON field', () => {
    const obj = {
      a: 1,
      b: 2,
      toJSON: () => void 0,
    }

    expect(toJSONObject(obj)).toMatchInlineSnapshot(`undefined`)

    const obj2 = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        toJSON: () => void 0,
      },
    }

    expect(toJSONObject(obj2)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 2,
        "c": undefined,
      }
    `)
  })

  it('should ignore circular', () => {
    const obj = {
      a: 1,
      b: 2,
    } as any

    obj.c = obj

    expect(toJSONObject(obj)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 2,
      }
    `)
  })
})
