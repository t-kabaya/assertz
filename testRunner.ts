import * as fs from 'fs'
import * as _ from 'lodash'
import { store } from './store'
import { createTestFailureMessage } from './createTestFailureMessage'
import { createSummary } from './lib/createSummary'

export const runTests = async (paths: string[]) => {
  const testStatus = await paths.reduce(
    (testStatus, file) => {
      // assertzのassertは、即時関数なので、テストファイルを、requireするだけで実行される。
      require(file)

      // test success
      store
        .filter(input => _.isEqual(input.received, input.expected))
        .forEach(() => (testStatus.successCount += 1))

      // test failure
      store
        .filter(input => !_.isEqual(input.received, input.expected))
        .map(input =>
          createTestFailureMessage(
            input.testName,
            input.received,
            input.expected,
            file.replace(/.+\//, '')
          )
        )
        .forEach(message => {
          console.log(message)
          testStatus.failureCount += 1
        })

      // reset store
      store.length = 0

      return testStatus
    },
    { successCount: 0, failureCount: 0 }
  )

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
