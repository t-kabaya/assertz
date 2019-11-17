// 失敗するテストを記述

const assert = require('../index')

assert(1, 2, 'number test')

assert('foo', 'bar', 'string test')

assert({ foo: 'foo' }, { bar: 'bar' }, 'object test')

// object test2
assert({ foo: { foo: 'foo' } }, { foo: { foo: 'bar' } }, 'object test2')

assert(true, false, 'boolean test')
