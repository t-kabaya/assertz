const chalk = require('chalk')

const createTestFailureMessage = (testName, received, expected, fileName) => {
  // pathか
  const failureMessage =
    '-----------------------------------------------------\n\n' +
    chalk.white(testName) +
    ' < ' +
    chalk.blue(fileName) +
    '\n\n' +
    'received:\n' +
    chalk.red(JSON.stringify(received)) +
    '\n' +
    'expected:\n' +
    chalk.green(JSON.stringify(expected)) +
    '\n'

  return failureMessage
}

module.exports = { createTestFailureMessage }
