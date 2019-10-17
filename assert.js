const { createTestFailureMessage } = require('./createTestFailureMessage')
const _ = require('lodash')
const testResultStore = require('./store')

const fileName = __dirname + process.argv[2].replace(/fileName=/, '')

// test resultを、storeにプッシュする
const assert = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    // テストが、成功したという情報は、いらない。
    const successMessage = '✔' + fileName + '\n' + 'passed'
    testResultStore.push({ successMessage })
    console.log(successMessage)
  } else {
    const failureMessage = createTestFailureMessage(
      received,
      expected,
      fileName
    )
    testResultStore.push({ failureMessage })
    console.log(failureMessage)
  }
}

module.exports = { assert }
