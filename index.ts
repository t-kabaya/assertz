import { store } from './store'

export const UNIT_TEST = 'unitTest'
export const SNAP = 'snap'

const assert = (received: any, expected: any, testName: string): void => {
  store.push({ received, expected, testName, type: UNIT_TEST })
}

const snap = (snap: any, testName: string) => {
  store.push({snap, testName, type: SNAP})
}

module.exports = {
  assert,
  snap
}
