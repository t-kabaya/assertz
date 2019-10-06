var glob = require('glob')
const { execSync } = require('child_process')
const { exec, execFile } = require('child_process')

execSync('node sandbox.js')

console.log('???')
const res = execSync('ls')
console.log(res)

exec('echo "The \\$HOME variable is $HOME"')

const options = {}

// options is optional
glob('**/test.*.js', options, function (er, files) {
  console.log(files)

  files.map(fileName => {
    console.log(fileName)
    execSync(`cat ${fileName}`)
    execSync('ls')
    exec('ls')
  })

  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
})
