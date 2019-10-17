const { createTestFailureMessage } = require('./createTestFailureMessage')
const _ = require('lodash')
const messageStore = require('./store')

const fileName = __dirname + process.argv[2].replace(/fileName=/, '')

// test resultを、storeにプッシュする
const assert = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    // テストが、成功したという情報は、いらない。
    const successMessage = '✔' + fileName + '\n' + 'passed'
    messageStore.push({ successMessage })
  } else {
    const failureMessage = createTestFailureMessage(
      received,
      expected,
      fileName
    )
    messageStore.push({ failureMessage })
  }
}

module.exports = { assert }
