const fs = require('fs')

const fileContent = require('fs')
  .readFileSync('README.md')
  .toString()
  .split('\n')
  .map((text, index) => `${index}: ` + text)
  .join('\n')

const readFileAsArray = path => {
  return fs
    .readFileSync(path)
    .toString()
    .split('\n')
}

const getTestNameAndAssert = path => {
  const fileContent = readFileAsArray(path)

  return { testName: 'foo', assert: 'assert' }
}

module.exports = { readFileAsArray, getTestNameAndAssert }
