exports.assert = (received, expected) => {
  return Object.is(received, expected)
}

// exports = { assert }
