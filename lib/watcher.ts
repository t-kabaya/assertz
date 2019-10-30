import * as fs from 'fs'
import { throttle } from 'lodash'

export const watcher = (runTests: any, path: string[], root: string): void => {
  fs.watch(root, { recursive: true }, (event: any, filename) => {
    if (!filename || event != 'change') return
    
    const throttle_runTests = throttle(runTests, 1000)
    throttle_runTests(path)
  })
}

