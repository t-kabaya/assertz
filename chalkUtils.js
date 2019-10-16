const chalk = require('chalk')

const customChalk = (string, { isDebugMode }) => {
  // isDebugMode
  if (isDebugMode) return string

  return chalk(string)
}

const doNothing = string => {
  return string
}

const getChalk = ({ isDebugMode }) => {
  if (isDebugMode) return doNothing

  return chalk
}

module.exports = { getChalk }
