const chalk = require('chalk')

const createSuccessMessage = successCount =>
  chalk.green(`${successCount} test passed\n`)

const createFailureMessage = failureCount =>
  chalk.red(`${failureCount} tests failed\n`)

const createSummary = ({ successCount, failureCount }) =>
  failureCount > 0
    ? createFailureMessage(failureCount)
    : createSuccessMessage(successCount)

module.exports = { createSummary, createSuccessMessage, createFailureMessage }
