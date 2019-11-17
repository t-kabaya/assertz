import { store } from './store'

const assert = (received: any, expected: any, testName: string): void => {
  store.push({ received, expected, testName })
}

module.exports = assert
exports.assert = assert
