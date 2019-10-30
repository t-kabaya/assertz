import * as fs from 'fs'
import * as _ from 'lodash'
import { store } from './store'
import { createTestFailureMessage } from './createTestFailureMessage'
import { createSummary } from './lib/createSummary'
import pipe from './utils/pipelineOperator'

// interface testStatusType {
//   fileName: string;
//   testStatus: ;
// }

export const runTests = (paths: string[]) => {

  // そもそも、テストが同時実行されない時点でよろしくない。
  // このコードを根本的に書き換える必要がある
  // 具体的には、現状は、一つのファイルをrequireして、その出力を行い、もう一つのファイルをrequireして、その出力を行いと言うように都度requireしてる。
  // これは、バグの元になる。（非同期コードで、シングルトンオブジェクトをなんども書き換えるため。）

  // そのため、全てのfileをrequireする。その後出来た巨大なsingleton objectを元に、コンソールへの出力を考えると言う段取りにする。

  // storeに全ての関数を入れてしまう。
  paths.forEach(path => {
    store.push({fileName: path})
    // 念の為、一瞬処理を遅らせる。
    process.nextTick(() => require(path))
  })

  // 以下のように、ちょっといびつなarray of jsonが帰ってくる。
  // [
  //   {fileName: './sandbox.js'},
  //   {received: 777, expected: 666}
  // ]

  
  const reducer = (acc: any, val: any) => {
    if (val.fileName) {
      // ファイルネームを一時的にセット
      acc.fileName = val.fileName
      return acc
    }

    if (_.isEqual(val.received, val.expected)) {
      // テスト成功
      acc.successCount += 1
      return acc
    }

    // テスト失敗
    acc.failureCount += 1
    const failureMessage = createTestFailureMessage(
      val.testName,
      val.received,
      val.expected,
      acc.fileName.replace(/.+\//, '')
    )
    console.log(failureMessage)
    
    return acc
  }

  const testResult = store.reduce(reducer, {fileName: '', successCount: 0, failureCount: 0})

  /* -------------------- show summary --------------------- */
  pipe(testResult, createSummary, console.log)
  // const summary = createSummary(testResult)
  // console.log(summary)
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
