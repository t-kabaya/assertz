// 失敗するテストを記述

const assert = require('../index')

assert(1, 2, 'number test')

assert('foo', 'bar', 'string test')

assert({ foo: 'foo' }, { bar: 'bar' }, 'object test')

assert(true, false, 'boolean test')
