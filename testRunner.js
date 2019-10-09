// const fs = require('fs')

// // __dirnameは本番環境では使えないので、../../などに変える。
// const fileNames = fs.readdirSync(__dirname)

// console.log(fileNames)

const executeTest = file => {
  // inheritがキモ。consoleの出力を共有出来る。
  console.log('executeTest' + file)
  if (file && file.endsWith('.test.js')) {
    require('child_process').execSync(`node ${file}`, { stdio: 'inherit' })
  }
}

const fs = require('fs')
const walk = dir => {
  const fileNames = fs.readdirSync(dir)

  // folders = fileNames.filter(file => )
  jsFiles = fileNames.filter(f => f.endsWith('.js'))
  console.log({ jsFiles })
  jsFiles.forEach(file => executeTest('/' + dir + '/' + file))
  executeTest()

  // gitとnode_modulesを取り除く。
  projectFileNames = fileNames.filter(f => f !== '.git' && f !== 'node_modules')

  if (!projectFileNames) return
  console.log({ projectFileNames })

  directories = projectFileNames.filter(f => {
    const stat = fs.statSync(dir + '/' + f)
    if (stat) {
      return stat.isDirectory()
    } else {
      return false
    }
  })
  console.log({ directories })
  // console.log({ directories })
  // const childDir = dir + '/' + directories[0]
  // console.log({ childDir })
  // console.log({ dir })
  // if (childDir) {
  //   console.log(fs.statSync(childDir).isDirectory())
  //   console.log(fs.readdirSync(childDir))
  // }

  directories.map(childDir => {
    console.log({ childDir })
    walk(dir + '/' + childDir)
  })

  // fileNames.forEach(fileName => {
  //   const stat = fs.statSync(fileName)
  //   console.log(stat.isDirectory())
  //   if (stat.isDirectory) {
  //     walk(dir + '/' + fileName)
  //   }
  //   // console.log(fileName)
  // })
}

const result = walk(__dirname)

// 完成した。
