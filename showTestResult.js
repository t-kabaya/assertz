const store = require('./store')

const showTestResult = () => {
  console.log('show Test Result')
  console.log(store)

  store.forEach(result => {
    console.log('result' + result)
  })

  // テストが終了したら、storeの初期化をする。
  // store = []
}

module.exports = showTestResult
