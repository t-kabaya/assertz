const test = require('ava')
const {
  createTestFailureMessage,
} = require('../lib/createTestFailureMessage')
import { ROOT_FOLDER } from'../env'

/* -------------------- createTestFailureMessage --------------------- */

test('createTestFailureMessage', async (t: any) => {
  const actual = createTestFailureMessage('test name', 777, 666, ROOT_FOLDER + '/lol', ROOT_FOLDER)

  const expected = `
test name < ./ava

diff:
-777
+666

`

  t.is(actual, expected)
})
