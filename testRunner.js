const fs = require('fs')
const { execSync } = require('child_process')

const testFileNamePattern = '.test.js'

const execTest = (path, fileName) => {
  // inheritがキモ。consoleの出力を共有出来る。
  const config = { stdio: 'inherit' }
  execSync(`node ${path} fileName=${fileName}`, config)
}

const findTests = dir => {
  const fileNames = fs.readdirSync(dir)

  const testFiles = fileNames.filter(f => f.endsWith(testFileNamePattern))
  testFiles.forEach(file => execTest('/' + dir + '/' + file, file))

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

  directories.map(childDir => findTests(dir + '/' + childDir))
}

module.exports = { findTests }
