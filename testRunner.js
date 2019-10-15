const fs = require('fs')

const executeTest = (path, fileName) => {
  // inheritがキモ。consoleの出力を共有出来る。
  if (path && path.endsWith('.test.js')) {
    require('child_process').execSync(`node ${path} fileName=${fileName}`, {
      stdio: 'inherit'
    })
  }
}

const runTest = dir => {
  const fileNames = fs.readdirSync(dir)

  const testFiles = fileNames.filter(f => f.endsWith('.js'))
  testFiles.forEach(file => executeTest('/' + dir + '/' + file, file))

  const projectFileNames = fileNames.filter(
    f => f !== '.git' && f !== 'node_modules'
  )

  if (!projectFileNames) return

  const directories = projectFileNames.filter(f => {
    const stat = fs.statSync(dir + '/' + f)
    if (stat) {
      return stat.isDirectory()
    } else {
      return false
    }
  })

  directories.map(childDir => {
    runTest(dir + '/' + childDir)
  })
}

module.exports = { runTest }
