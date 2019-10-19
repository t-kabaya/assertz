const fs = require('fs')
const { execSync } = require('child_process')

const testFileNamePattern = '.test.js'

const execTests = (testFiles, dir) => {
  // TODO: fileNameを、テスト結果に載せる。
  // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
  require(path)
}

const foundedTests = []

// TODO: findTestsの中で、execTestを実行するのは、関数型らしくない。
// findTestsで、pathの、配列を作成してから、それを帰り値として、returnし、execTestはそれを引数として取得するようにリファクタリングする。
const findTests = dir => {
  const result = []

  const walk = dir => {
    const fileNames = fs.readdirSync(dir)

    // fileNames.forEach()

    const testFiles = fileNames.filter(f => f.endsWith(testFileNamePattern))
    const tmpResult = testFiles.map(file => '/' + dir + '/' + file)
    // result.push(tmpResult)
    tmpResult.forEach(files => {
      result.push(files)
    })

    // gitと、node_modulesを除外
    const projectFileNames = fileNames.filter(
      f => f !== '.git' && f !== 'node_modules'
    )

    if (!projectFileNames) return

    const directories = projectFileNames.filter(f => {
      const stat = fs.statSync(dir + '/' + f)
      if (!stat) return false

      return stat.isDirectory()
    })

    directories.map(childDir => walk(dir + '/' + childDir))
  }

  walk(dir)

  return result
}

module.exports = { findTests }
