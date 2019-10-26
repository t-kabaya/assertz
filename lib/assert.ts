import { store } from '../store'

export const assert = (testName: string, received: any, expected: any): void => {
  store.push({ testName, received, expected })
}
