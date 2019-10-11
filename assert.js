const _ = require('lodash')

const assert = (received, expected) => {
  // for deepEqual
  return _.isEqual(received, expected)
}

module.exports = { assert }
