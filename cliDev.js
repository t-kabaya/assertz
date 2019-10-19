// testrunner for develop
const { findTests, runTests } = require('./testRunner')
const showTestResult = require('./showTestResult')

// (__dirname)

const paths = findTests(__dirname)
runTests(paths)

// const cli = async () => {
//   try {
//     const isSuccess = await runTests(__dirname)

//     showTestResult()
//   } catch (e) {
//     console.log('error at cliForDevelop')
//   }
// }

// cli()
