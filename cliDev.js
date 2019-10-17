// testrunner for develop
const { findTests } = require('./testRunner')
const showTestResult = require('./showTestResult')

// remove /node_modules/assertz\

findTests(__dirname)

const cli = async () => {
  try {
    const isSuccess = await findTests(__dirname)

    showTestResult()
  } catch (e) {
    console.log('error at cliForDevelop')
  }
}

cli()
