import * as fs from 'fs'
import * as _ from 'lodash'
import { store } from './store'
import { createTestFailureMessage } from './createTestFailureMessage'
import { createSummary } from './createSummary'
import pipe from '../utils/pipelineOperator'
import log from '../utils/logUtils'
import { runSnapShotTest } from './snapshot'
import { SNAP } from '../index'
import { ROOT_FOLDER } from '../env'

export const runTests = async(paths: string[]) => {
  for await (const path of paths) {
    store.push({path})
    require(path)
  }
  // 以下のように、ちょっといびつなarray of jsonが帰ってくる。
  // [
  //   {path: './sandbox.js'},
  //   {testName: 'lol', received: 777, expected: 666},
  //   {testName: 'lol', received: 'foo', expected: 'bar'}
  // ]

  const reducer = (acc: any, val: any) => {
    if (val.path) {
      // set tmp path
      acc.path = val.path

      return acc
    }

    // snap shot test
    if (val.type === SNAP) {
      acc.snapShotStore.push({snap: val.snap, testName: val.testName, path: acc.path})

      return acc
    }

    if (_.isEqual(val.received, val.expected)) {
      // テスト成功
      acc.successCount += 1
      return acc
    }

    // テスト失敗
    acc.failureCount += 1
    pipe(
      createTestFailureMessage(
        val.testName,
        val.received,
        val.expected,
        acc.path,
        ROOT_FOLDER
      ),
      log
    )
    
    return acc
  }

  const testResult = store.reduce(reducer, {path: '', successCount: 0, failureCount: 0, snapShotStore: []})

  /* -------------------- show summary --------------------- */
  pipe(testResult, createSummary, log)

  const { snapShotStore } = testResult
  const snapShotResult = runSnapShotTest(snapShotStore)
  console.log(snapShotResult)
  // findFailureTest(snapShotStore)

}


export const findTests = (dir: string): string[] => {
  const testPath: string[] = []

  const walk = (dir: string) => {
    const files = fs.readdirSync(dir)

    files
      // test.jsで終わるファイルを、テストファイルと見なす。
      .filter((f: string)  => f.endsWith('.test.js') || f.endsWith('.test.ts'))
      .map((file: string) => '/' + dir + '/' + file)
      .forEach((files: string) => testPath.push(files))

    files
      // .gitと、node_modulesは、エラーを引き起こすので、除外する。
      .filter((f: string) => f !== '.git')
      .filter((f: string) => f !== 'node_modules')
      // フォルダのみ次へ
      .filter((file: string) => {
        const stat = fs.statSync(dir + '/' + file)
        if (!stat) return false

        return stat.isDirectory()
      })
      .forEach((childDir: string) => walk(dir + '/' + childDir))
  }

  walk(dir)

  return testPath
}
