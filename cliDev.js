// testrunner for develop
const { findTests, runTests } = require('./testRunner')
const showTestResult = require('./showTestResult')
const { store } = require('./store')

// (__dirname)

const paths = findTests(__dirname)
runTests(paths)

// console.log(store)

// const cli = async () => {
//   try {
//     const isSuccess = await runTests(__dirname)

//     showTestResult()
//   } catch (e) {
//     console.log('error at cliForDevelop')
//   }
// }

// cli()
