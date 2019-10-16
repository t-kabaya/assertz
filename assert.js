const { createTestFailureMessage } = require('./createTestFailureMessage')
const _ = require('lodash')

const assert = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    // テストが、成功したという情報は、いらない。
    console.warn('passed')
  } else {
    const fileName = process.argv[2].replace(/fileName=/, '')
    const failureMessage = createTestFailureMessage(
      received,
      expected,
      fileName
    )
    console.log(failureMessage)
  }
}

module.exports = { assert }
