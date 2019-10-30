import { findTests, runTests } from './testRunner'
import { NODE_ENV } from './env'
// import { watcher } from './lib/watcher'
import {throttle} from 'lodash'

const root =
  NODE_ENV === 'development'
    ? __dirname
    : __dirname.replace('/node_modules/assertz', '')


// console.log(paths)
// runTests(paths)

import * as fs from 'fs'
fs.watch(root, { recursive: true }, (event: any, filename) => {
  console.log(event)
  if (!!!filename) return

  const paths: string[] = findTests(root)
  const throttle_runTest = throttle(runTests, 30000)
  throttle_runTest(paths)
})


