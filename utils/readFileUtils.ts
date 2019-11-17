import * as fs from 'fs'

const fileContent = fs
  .readFileSync('README.md')
  .toString()
  .split('\n')
  .map((text: string, index: Number) => `${index}: ` + text)
  .join('\n')

const readFileAsArray = (path: string): string[] => {
  return fs.readFileSync(path)
    .toString()
    .split('\n')
}

const getTestNameAndAssert = (path: string) => {
  const fileContent = readFileAsArray(path)

  return { testName: 'foo', assert: 'assert' }
}

module.exports = { readFileAsArray, getTestNameAndAssert }

// TODO: 実装中