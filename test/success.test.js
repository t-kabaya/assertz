const assert = require('../index')

assert(1, 3)

assert(2, 2)

// object
const obj1 = { foo: 'foo' }
const obj2 = { foo: 'foo' }

assert(obj1, obj2)

// async test
const asyncTest = async () => {
  const apiResponse = await 89
  assert(777, 666)
}

asyncTest()
