const test = require('ava')

test('foo', (t: any) => {
  t.pass()
})

test('bar', async (t: any) => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})
