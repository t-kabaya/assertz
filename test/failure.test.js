// 失敗するテストを記述

const assert = require('../index')

assert('number test', 1, 2)

assert('string test', 'foo', 'bar')

assert('object test', { foo: 'foo' }, { bar: 'bar' })

assert('boolean test', true, false)
