const { assert } = require('./assert')
const { showTestFailureDiff } = require('./showTestFailureDiff')

const executeTest = (received, expected) => {
  const isPass = assert(received, expected)

  if (isPass) {
    console.warn('test passed')
  } else {
    const errorMessage = showTestFailureDiff(received, expected)
    console.warn('test failed')
    console.log(errorMessage)
  }
}

module.exports = { executeTest }
