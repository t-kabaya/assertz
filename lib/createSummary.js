const chalk = require('chalk')

const createSuccessMessage = successCount =>
  chalk.green(`${successCount} test passed`)

const createFailureMessage = failureCount =>
  chalk.red(`${failureCount} tests failed`)

const createSummary = ({ successCount, failureCount }) =>
  failureCount > 0
    ? createFailureMessage(failureCount)
    : createSuccessMessage(successCount)

module.exports = { createSummary, createSuccessMessage, createFailureMessage }
