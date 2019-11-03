import { store } from './store'

const assert = (testName: string, received: any, expected: any): void => {
  store.push({ testName, received, expected })
}

module.exports = assert
