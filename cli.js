const { runTest } = require('./testRunner')
const showTestResult = require('./showTestResult')

// remove /node_modules/assertz\
const cli = async () => {
  await runTest(__dirname.replace('/node_modules/assertz', ''))

  // testRunnerの実行後に、以下の、showResultメソッドが呼ばれる。
  showTestResult()
  console.log('test end')
}

cli()
