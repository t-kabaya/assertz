var glob = require('glob')
const { execSync } = require('child_process')
const { exec, execFile } = require('child_process')

execSync('node sandbox.js')
const sandboxFileName = 'sandbox.js'
execSync(`node ${sandboxFileName}`)

const options = {}

let filePaths = []
glob('**/test.*.js', options, (er, files) => {
  console.log(files)
  filePaths = files

  files.map(fileName => {
    console.log(fileName)
    execSync(`node ${fileName}`)
  })
})

console.log(filePaths)
