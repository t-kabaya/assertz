const { store } = require('../store')

// test resultを、storeにプッシュする
const assert = (testName, received, expected) => {
  store.push({ testName, received, expected })
}

module.exports = { assert }
