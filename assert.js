const { createTestFailureMessage } = require('./createTestFailureMessage')
const _ = require('lodash')
const { store } = require('./store')
const getLineNumber = require('./lib/getLineNumber')

const fileName = 'test failed'

// test resultを、storeにプッシュする
const assert = (received, expected) => {
  const lineNumber = getLineNumber()
  store.push({ received, expected, lineNumber })

  // const isPass = _.isEqual(received, expected)

  // if (isPass) {
  //   // テストが、成功したという情報は、いらない。
  //   const successMessage = '✔' + fileName + '\n' + 'passed'
  //   // store.push({ successMessage })
  //   console.log(successMessage)
  // } else {
  //   const failureMessage = createTestFailureMessage(
  //     received,
  //     expected,
  //     fileName
  //   )
  //   // store.push({ failureMessage })
  //   console.log(failureMessage)
  // }
}

module.exports = { assert }
