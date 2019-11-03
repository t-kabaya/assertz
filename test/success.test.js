const assert = require('../index')

const obj1 = { foo: 'foo' }
const obj2 = { foo: 'foo' }

assert(obj1, obj2, 'object test')

{
  // async test
  ;(async () => {
    const apiResponse = await 777
    assert(apiResponse, 777, 'async test')
  })()
}
