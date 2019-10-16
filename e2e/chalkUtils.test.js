const { getChalk } = require('../chalkUtils')
const assert = require('assertz')

const chalk = getChalk({ isDebugMode: true })

{
  const input = 'foo'
  const output = 'bar'

  assert(chalk(input), output)
}
