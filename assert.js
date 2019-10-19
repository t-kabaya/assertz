const { createTestFailureMessage } = require('./createTestFailureMessage')
const _ = require('lodash')
const { store } = require('./store')

const fileName = 'test failed'

// test resultを、storeにプッシュする
const assert = (received, expected) => {
  store.push({ received, expected })

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
