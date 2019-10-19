const cli = require('commander')

cli.option('-h, --help', 'help me')

cli.parse(process.argv)

console.log('added commander')
