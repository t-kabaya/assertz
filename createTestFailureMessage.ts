const chalk = require('chalk')

export const createTestFailureMessage = (testName: string, received: any, expected: any, fileName: string): string => {
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
