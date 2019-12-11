const chalk = require('chalk')
const { diffString } = require('json-diff')

export const createTestFailureMessage = (testName: string, received: any, expected: any, fileName: string): string => (
  '-----------------------------------------------------\n\n' +
    chalk.white(testName) +
    ' < ' +
    chalk.blue(fileName) +
    '\n\n' +
    'diff:\n' +
    // chalk.red(JSON.stringify(received)) +
    // '\n' +
    // 'expected:\n' +
    // chalk.green(JSON.stringify(expected)) +
    diffString(received, expected) + 
    '\n'
)
