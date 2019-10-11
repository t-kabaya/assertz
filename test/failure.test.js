// 失敗するテストを記述

const { assert } = require('../index')

// number
assert(1, 2)

// string
assert('foo', 'bar')

// object
assert({ foo: 'foo' }, { bar: 'bar' })

// boolean
assert(true, false)
