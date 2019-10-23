const fs = require('fs')
const { execSync } = require('child_process')
const _ = require('lodash')
const { store } = require('./store')
const { createTestFailureMessage } = require('./createTestFailureMessage')
const { createSummary } = require('./lib/createSummary')

const runTests = async paths => {
  const testStatus = await paths.reduce(
    (testStatus, file) => {
      // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
      require(file)

      // test success
      const successTests = store
        .filter(input => _.isEqual(input.received, input.expected))
        .forEach(() => {
          console.log('passed')
          testStatus.successCount += 1
        })

      // test failure
      store
        .filter(input => !_.isEqual(input.received, input.expected))
        .map(input =>
          createTestFailureMessage(
            input.testName,
            input.received,
            input.expected,
            file.replace(/.+\//, '')
          )
        )
        .forEach(message => {
          console.log(message)
          testStatus.failureCount += 1
        })

      // reset store
      store.length = 0

      return testStatus
    },
    { successCount: 0, failureCount: 0 }
  )

  /* -------------------- show summary --------------------- */

  const summary = createSummary(testStatus)
  console.log(summary)
}

const findTests = dir => {
  const testPath = []

  const walk = dir => {
    const files = fs.readdirSync(dir)

    files
      // test.jsで終わるファイルを、テストファイルと見なす。
      .filter(f => f.endsWith('.test.js'))
      .map(file => '/' + dir + '/' + file)
      .forEach(files => testPath.push(files))

    files
      // .gitと、node_modulesは、エラーを引き起こすので、除外する。
      .filter(f => f !== '.git')
      .filter(f => f !== 'node_modules')
      // フォルダのみ次へ
      .filter(file => {
        const stat = fs.statSync(dir + '/' + file)
        if (!stat) return false

        return stat.isDirectory()
      })
      .forEach(childDir => walk(dir + '/' + childDir))
  }

  walk(dir)

  return testPath
}

module.exports = { findTests, runTests }
