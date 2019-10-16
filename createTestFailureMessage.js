const chalk = require('chalk')

const createTestFailureMessage = (received, expected, fileName) => {
  const failureMessage =
    chalk.gray(fileName) +
    '\n' +
    'Difference:' +
    '\n' +
    chalk.red('- ') +
    JSON.stringify(received) +
    '\n' +
    chalk.green('+ ') +
    JSON.stringify(expected)

  return failureMessage
}

module.exports = { createTestFailureMessage }
