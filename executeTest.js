const { showTestFailureDiff } = require('./showTestFailureDiff')
const _ = require('lodash')

const executeTest = (received, expected) => {
  const isPass = _.isEqual(received, expected)

  if (isPass) {
    console.warn('test passed')
  } else {
    const errorMessage = showTestFailureDiff(received, expected)
    console.warn('test failed')
    console.log(errorMessage)
  }
}

module.exports = { executeTest }
