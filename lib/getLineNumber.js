const getLineNumber = () => {
  let e = new Error()
  let frame = e.stack.split('\n')[2]
  let lineNumber = frame.split(':')[1]
  return Number(lineNumber)
}

module.exports = getLineNumber
