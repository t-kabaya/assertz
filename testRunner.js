const fs = require('fs')
const { execSync } = require('child_process')
const _ = require('lodash')
const { store } = require('./store')
const { createTestFailureMessage } = require('./createTestFailureMessage')

const runTests = async paths => {
  // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
  await paths.forEach(file => require(file))

  // 上の、requireを実行すると、storeに、{received: 'foo', expected: 'lol'}が、cacheされる。

  // test success
  const successTests = store.filter(obj =>
    _.isEqual(obj.received, obj.expected)
  )
  successTests.forEach(() => console.log('passed'))

  // testFailure
  const failureTests = store.filter(
    obj => !_.isEqual(obj.received, obj.expected)
  )

  failureTests
    .map(obj =>
      createTestFailureMessage(obj.received, obj.expected, 'mockFileName')
    )
    .forEach(message => console.log(message))

  /* -------------------- show summury --------------------- */
  const successTestCount = successTests.length
  const failureTestCount = failureTests.length

  const summury = `
summury:
passed count: ${successTestCount}
failure count: ${failureTestCount}
`
  console.log(summury)
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
