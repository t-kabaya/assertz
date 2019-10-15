const { runTest } = require('./testRunner')

// remove /node_modules/assertz\

runTest(__dirname.replace('/node_modules/assertz', ''))
