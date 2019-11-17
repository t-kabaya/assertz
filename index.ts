import { store } from './store'

const assert = (received: any, expected: any, testName: string): void => {
  store.push({ received, expected, testName, type: 'unitTest' })
}

const snap = (snap: any, testName: string) => {
  store.push({snap, testName, type: 'snap'})
}

module.exports = assert
// exports.assert = assert
// exports.snap = snap
module.exports = {
  assert: assert,
  snap: snap
}
