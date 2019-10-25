const fs = require('fs')

const fileContent = require('fs')
  .readFileSync('README.md')
  .toString()
  .split('\n')
  .map((text: String, index: Number) => `${index}: ` + text)
  .join('\n')

const readFileAsArray = (path: String): String => {
  return fs
    .readFileSync(path)
    .toString()
    .split('\n')
}

const getTestNameAndAssert = (path: String) => {
  const fileContent = readFileAsArray(path)

  return { testName: 'foo', assert: 'assert' }
}

module.exports = { readFileAsArray, getTestNameAndAssert }
