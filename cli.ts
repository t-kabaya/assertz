import { findTests, runTests } from './testRunner'
import { NODE_ENV } from './env'

const root =
  NODE_ENV === 'development'
    ? __dirname
    : __dirname.replace('/node_modules/assertz', '')

const paths: string[] = findTests(root)

runTests(paths)
