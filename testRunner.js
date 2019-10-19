const fs = require('fs')
const { execSync } = require('child_process')

const runTests = paths => {
  // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
  paths.forEach(file => require(file))
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
