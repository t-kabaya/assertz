const { showTestFailureDiff } = require('./showTestFailureDiff')
const _ = require('lodash')

const assert = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    // テストが、成功したという情報は、いらない。
    // console.warn('test passed')
  } else {
    const fileName = process.argv[2].replace(/fileName=/, '')
    showTestFailureDiff(received, expected, fileName)
  }
}

module.exports = { assert }
