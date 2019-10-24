const { findTests, runTests } = require('./testRunner')
const showTestResult = require('./showTestResult')
const { store } = require('./store')

const paths = findTests(__dirname.replace('/node_modules/assertz', ''))
runTests(paths)
