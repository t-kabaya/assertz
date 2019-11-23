import * as fs from 'fs'
import * as _ from 'lodash'
import { store } from './store'
import { createTestFailureMessage } from './createTestFailureMessage'
import { createSummary } from './lib/createSummary'
import pipe from './utils/pipelineOperator'
import log from './utils/logUtils'
import { runSnapShotTest } from './lib/snapshot'

export const runTests = async(paths: string[]) => {

  // そもそも、テストが同時実行されない時点でよろしくない。
  // 具体的には、現状は、一つのファイルをrequireして、その出力を行い、もう一つのファイルをrequireして、その出力を行いと言うように都度requireしてる。
  // そのため、全てのfileをrequireする。その後出来た巨大なsingleton objectを元に、コンソールへの出力を考えると言う段取りにする。

  // storeに全てのtest objectを入れてしまう。
  for await (const path of paths) {
    store.push({fileName: path})
    require(path)
  }
  // 以下のように、ちょっといびつなarray of jsonが帰ってくる。
  // [
  //   {fileName: './sandbox.js'},
  //   {testName: 'lol', received: 777, expected: 666},
  //   {testName: 'lol', received: 'foo', expected: 'bar'}
  // ]

  const reducer = (acc: any, val: any) => {
    if (val.fileName) {
      // ファイルネームを一時的にセット
      acc.fileName = val.fileName

      return acc
    }

    // snap shot test
    if (val.type === 'snap') {
      acc.snapShotStore.push({snap: val.snap, testName: val.testName, path: acc.fileName})

      return acc
    }

    // snap

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
        acc.fileName.replace(/.+\//, '')
      ),
      log
    )
    
    return acc
  }

  const testResult = store.reduce(reducer, {fileName: '', successCount: 0, failureCount: 0, snapShotStore: []})

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
