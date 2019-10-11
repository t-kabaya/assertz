const showTestFailureDiff = (received, expected) => {
  const failureMessage = `
  received:
  ${JSON.stringify(received)}
  expected:
  ${JSON.stringify(expected)}
  `
  return failureMessage
}

module.exports = { showTestFailureDiff }
