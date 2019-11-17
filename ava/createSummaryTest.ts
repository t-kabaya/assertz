const test = require('ava')
const {
  createSummary,
  createSuccessMessage,
  createFailureMessage
} = require('../lib/createSummary')

/* -------------------- createSummary --------------------- */

test('must return String', async (t: any) => {
  const input = { successCount: 1, failureCount: 9 }
  const output = createSummary(input)

  t.is(typeof output, 'string')
})

test('must create test FailureMessage when failureCount > 0', async(t: any) => {
  const input = { successCount: 1, failureCount: 9 }

  const failureMessage = createFailureMessage(input.failureCount)
  const output = createSummary(input)

  t.is(output, failureMessage)
})

test('must create test successMessage when failureCount = 0', async(t: any) => {
  const input = { successCount: 1, failureCount: 0 }

  const failureMessage = createSuccessMessage(input.successCount)
  const output = createSummary(input)

  t.is(output, failureMessage)
})

/* -------------------- createSuccessMassage --------------------- */

/* --------------------  --------------------- */
