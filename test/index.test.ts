import { describe, expect, it } from 'vitest'
import DummyClass from '@/index'

/**
 * Dummy test
 */
describe('dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('dummyClass is instantiable', () => {
    expect(new DummyClass()).toBeInstanceOf(DummyClass)
  })
})
