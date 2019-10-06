const { assert } = require('./assert')

exports.executeTest = (received, expected) => {
  const isPass = assert(received, expected)

  if (isPass) {
    console.warn('test passed')
  } else {
    console.warn('test failed')
  }
}
