const chalk = require('chalk')
const { diffString } = require('json-diff')

export const createTestFailureMessage = (testName: string, received: any, expected: any, path: string, ROOT_FOLDER: string): string => {
  return '-----------------------------------------------------\n\n' +
  chalk.white(testName) +
  ' < ' +
  // TODO: this regex cause problem what is // Users?
  chalk.blue(path.replace(ROOT_FOLDER, '.').replace(/^\//, '') ) +
  '\n\n' +
  'diff:\n' +
  diffString(received, expected) +
  '\n'
}
