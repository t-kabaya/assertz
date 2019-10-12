const chalk = require('chalk')

const showTestFailureDiff = (received, expected, fileName) => {
  const log = console.log
  log(chalk.gray(fileName))
  log('Difference:')
  log('')
  log(chalk.red('- ') + JSON.stringify(received))
  log(chalk.green('+ ') + JSON.stringify(expected))
}

module.exports = { showTestFailureDiff }
