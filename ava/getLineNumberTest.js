const test = require('ava')
const getLineNumber = require('../lib/getLineNumber')

test('must get Line number 5', t => {
  const lineNumber = getLineNumber()
  t.is(lineNumber, 5)
})

test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})
