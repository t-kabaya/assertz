import * as fs from 'fs'
import * as _ from 'lodash'
import { store } from './store'
import { createTestFailureMessage } from './createTestFailureMessage'
import { createSummary } from './lib/createSummary'

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

  
  const testStatus: any = store.reduce((acc, val) => {
    // ファイルネームをリターン。
    if (val.fileName) {
      acc.fileName = val.fileName
      return acc
    }

    if (_.isEqual(val.received, val.expected)) {
      // テスト成功
      acc.testStatus.successCount += 1
    } else {
      // テスト失敗
      acc.testStatus.failureCount += 1
      const failureMessage = createTestFailureMessage(
        val.testName,
        val.received,
        val.expected,
        acc.fileName.replace(/.+\//, '')
        )
      console.log(failureMessage)
    }

    return acc
  }, {fileName: '', testStatus: {successCount: 0, failureCount: 0}})


  // const reducer = async(testStatus: testStatusType, file: string) => {
  //   // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
  //   await require(file)
  //   console.log(store)
    
  //   // test success
  //   await store
  //   .filter(input => _.isEqual(input.received, input.expected))
  //   .forEach(() => (testStatus.successCount += 1))
    
  //   // test failure
  //   await store
  //   .filter(input => !_.isEqual(input.received, input.expected))
  //   .map(input =>
  //     createTestFailureMessage(
  //       input.testName,
  //       input.received,
  //       input.expected,
  //       // root/usr/test.jsから、一番最後の単語を抜き出し、test.jsのように加工する。
  //       file.replace(/.+\//, '')
  //     )
  //   )
  //   .forEach(message => {
  //     console.log(message)
  //     testStatus.failureCount += 1
  //   })
    
    // reset store
    // await store.length = 0
    
  //   return testStatus
  // }
  
  // const testStatus = await paths.reduce(reducer, { successCount: 0, failureCount: 0 })

  /* -------------------- show summary --------------------- */
  const summary = createSummary(testStatus)
  console.log(summary)
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
