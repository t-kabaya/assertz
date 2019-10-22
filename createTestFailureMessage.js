const chalk = require('chalk')

const createTestFailureMessage = (testName, received, expected, fileName) => {
  const failureMessage =
    chalk.gray(testName) +
    '\n' +
    'Difference:' +
    '\n' +
    chalk.red('- ') +
    JSON.stringify(received) +
    '\n' +
    chalk.green('+ ') +
    JSON.stringify(expected) +
    '\n'

  return failureMessage
}

module.exports = { createTestFailureMessage }
