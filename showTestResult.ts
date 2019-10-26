const { testResultStore } = require('./store')

const showTestResult = (): void => {
  console.log('show Test Result')
  console.log(testResultStore)

  testResultStore.forEach((result: string) => console.log('result' + result))

  // テストが終了したら、storeの初期化をする。
  // store = []
}

module.exports = showTestResult
