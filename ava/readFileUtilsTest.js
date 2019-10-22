const test = require('ava')
const {
  readFileAsArray,
  getTestNameAndAssert
} = require('../utils/readFileUtils')

/* -------------------- readFileAsArray --------------------- */

test('must get Line number 5', t => {
  const fileContent = readFileAsArray('ava/fixture/readFileFixture.js')
  const expectedFileContent = [
    "const assert = require('mockassertz')",
    '',
    '// awesome test',
    "assert('awesome test', 'foo', 'bar')",
    ''
  ]

  t.deepEqual(fileContent, expectedFileContent)
})

/* -------------------- get test name and content --------------------- */

test('must return test name and assert content', t => {
  const output = getTestNameAndAssert('ava/fixture/readFileFixture.js')
  const expected = {
    testName: 'awesome test',
    assert: "assert('awesome test', 'foo ',  'bar')"
  }

  t.deepEqual(output, expected)
})
