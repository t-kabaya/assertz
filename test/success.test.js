const { assert } = require('../index')

const obj1 = { foo: 'foo' }
const obj2 = { foo: 'foo' }

assert(obj1, obj2, 'object test')

const map1 = new Map()
const map2 = new Map()

assert(map1, map2, 'map success test')

assert(new Set([1, 2, 3]), new Set([1, 2, 3]), 'assertTest')

{
  // async test
  ;(async () => {
    const apiResponse = await 777
    assert(apiResponse, 777, 'async test')
  })()
}
