const test = require('ava')
const {
  createTestFailureMessage,
} = require('../lib/createTestFailureMessage')
import { ROOT_FOLDER } from'../env'
const stripAnsi = require('strip-ansi')

/* -------------------- createTestFailureMessage --------------------- */

test('createTestFailureMessage', async (t: any) => {
  const path = ROOT_FOLDER + '/test/foo.test.ts'
  const actual = stripAnsi(createTestFailureMessage('test name', 777, 666, path, ROOT_FOLDER))

  const expected = `-----------------------------------------------------

test name < ./test/foo.test.ts

diff:
-777
+666

`

  t.is(actual, expected)
})
