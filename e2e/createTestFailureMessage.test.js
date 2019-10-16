const { createTestFailureMessage } = require('../createTestFailureMessage')
const assert = require('assertz')

{
  const received = 67
  const expected = 70
  const fileName = 'fileName'

  const output = createTestFailureMessage(received, expected, fileName)
  assert(output, 89)
}
