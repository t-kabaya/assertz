const { testResultStore } = require('./store')

const showTestResult = () => {
  console.log('show Test Result')
  console.log(testResultStore)

  testResultStore.forEach(result => {
    console.log('result' + result)
  })

  // テストが終了したら、storeの初期化をする。
  // store = []
}

module.exports = showTestResult
