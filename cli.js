const { findTests, runTests } = require('./testRunner')
const showTestResult = require('./showTestResult')
const { store } = require('./store')

const env = process.env.ENV
const root =
  env === 'development'
    ? __dirname
    : __dirname.replace('/node_modules/assertz', '')
const paths = findTests(root)
runTests(paths)
