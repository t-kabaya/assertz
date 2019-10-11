// // __dirnameは本番環境では使えないので、../../などに変える。
// const fileNames = fs.readdirSync(__dirname)

const executeTest = file => {
  // inheritがキモ。consoleの出力を共有出来る。
  // console.log('executeTest' + file)
  if (file && file.endsWith('.test.js')) {
    require('child_process').execSync(`node ${file}`, { stdio: 'inherit' })
  }
}

const fs = require('fs')
const runTest = dir => {
  const fileNames = fs.readdirSync(dir)

  // folders = fileNames.filter(file => )
  const jsFiles = fileNames.filter(f => f.endsWith('.js'))
  // console.log({ jsFiles })
  jsFiles.forEach(file => executeTest('/' + dir + '/' + file))
  executeTest()

  // gitとnode_modulesを取り除く。
  const projectFileNames = fileNames.filter(
    f => f !== '.git' && f !== 'node_modules'
  )

  if (!projectFileNames) return
  // console.log({ projectFileNames })

  const directories = projectFileNames.filter(f => {
    const stat = fs.statSync(dir + '/' + f)
    if (stat) {
      return stat.isDirectory()
    } else {
      return false
    }
  })

  directories.map(childDir => {
    // console.log({ childDir })
    runTest(dir + '/' + childDir)
  })

  // fileNames.forEach(fileName => {
  //   const stat = fs.statSync(fileName)
  //   console.log(stat.isDirectory())
  //   if (stat.isDirectory) {
  //     runTest(dir + '/' + fileName)
  //   }
  //   // console.log(fileName)
  // })
}

const result = runTest(__dirname)

// 完成した。
