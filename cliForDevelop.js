// testrunner for develop
const { runTest } = require('./testRunner')
const showTestResult = require('./showTestResult')

// remove /node_modules/assertz\

runTest(__dirname)

const cli = async () => {
  await runTest(__dirname)

  showTestResult()
}

cli()
