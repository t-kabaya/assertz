const assert = require('../index')

const obj1 = { foo: 'foo' }
const obj2 = { foo: 'foo' }

assert('object test', obj1, obj2)

{
  // async test
  ;(async () => {
    const apiResponse = await 777
    assert('async test', apiResponse, 777)
  })()
}
