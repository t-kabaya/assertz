// testrunner for develop
const { runTest } = require('./testRunner')
const showTestResult = require('./showTestResult')

// remove /node_modules/assertz\

runTest(__dirname)

const cli = async () => {
  try {
    const isSuccess = await runTest(__dirname)

    showTestResult()
  } catch (e) {
    console.log('error at cliForDevelop')
  }
}

cli()
