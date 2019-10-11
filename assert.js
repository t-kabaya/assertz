const { showTestFailureDiff } = require('./showTestFailureDiff')
const _ = require('lodash')

const assert = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    console.warn('test passed')
  } else {
    console.warn('test failed')
    const errorMessage = showTestFailureDiff(received, expected)
    console.log(errorMessage)
  }
}

module.exports = { assert }
