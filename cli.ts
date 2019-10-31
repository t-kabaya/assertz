// import { watcher } from './lib/watcher'
import { throttle } from 'lodash'
import * as commander from 'commander'
import * as fs from 'fs'
import { findTests, runTests } from './testRunner'
import { ROOT_FOLDER } from './env'

commander.version(require('./package.json').version)

commander
  .option('-d, --debug', 'output extra debugging')
  .option('-w, --watch', 'watch mode')

commander.parse(process.argv)

const paths: string[] = findTests(ROOT_FOLDER)
const throttle_runTest = throttle(runTests, 1000)

if (commander.watch) {
  throttle_runTest(paths)

  fs.watch(ROOT_FOLDER, { recursive: true }, ({}, filename: string) => {
    if (!filename) return
    
    throttle_runTest(paths)
  })
} else {
  throttle_runTest(paths)
}


