import * as fs from 'fs'
import * as _ from 'lodash'
const { diffString } = require('json-diff')
import { store } from './store'
import pipe from '../utils/pipelineOperator'
// node.jsのwriteFileする際に、ファイルが存在しないと、エラーが出る。
// fsPathを使用すると、もし、ファイルが存在しない時は、ファイルを作成してくれる。
const fsPath = require('fs-path')

// use type instead of interface, because type is enough for my purpose.
type snapType = {
  testName: string;
  snap: any;
  path: string;
}

type storeType = ({path: string} | {type: string, testName: string, snap: object})[]

export const updateSnapshot = async (paths: string[]) => {
  for await (const path of paths) {
    store.push({path})
    require(path)
  }

  console.log('start update snapshot')
  pipe(store, excludeNotSnapshot, createSnapshotJson).forEach((snapObj: {path: string, snap: object}) => 
    fsPath.writeFileSync(createSnapshotPath(snapObj.path), JSON.stringify(snapObj.snap))
  )
  console.log('updated snapshot')
}

export const excludeNotSnapshot = (store: any[]) => {
  const snapTests = store.filter((obj: any) => obj.type !== "unitTest")
  const isExistSnap = snapTests.filter((obj: any) => obj.type === "snap").length === 0
  
  if (isExistSnap) return []
  
  return snapTests.filter((obj: any, i: any) => {
    if (i === snapTests.length) return true
    
    return !(obj?.path && snapTests[i + 1]?.path)
  })
}

export const createSnapshotJson = (store: storeType): object[] => (
  store.reduce((acc: {path: string, snap: any}[], crr: any) => {
    if (crr.path) {
       acc.push({path: crr.path, snap: {}})
    } else {
      acc[acc.length - 1].snap[crr.testName] = crr.snap
    }

    return acc
  }, [])
)

export const createSnapShotReport = (oldSnapShot: snapType[], newSnapShot: snapType[]): (string | undefined)[] => (
  newSnapShot.map(newSS => {
    const snapshotNeedUpdate = oldSnapShot.filter(oldSS => oldSS.testName === newSS.testName && !_.isEqual(oldSS.snap, newSS.snap))
    return snapshotNeedUpdate.map( oldSS =>
      // show message if same name and not same snapshot content
      `Snapshot > ${newSS.testName}
diff:
${diffString(oldSS.snap, newSS.snap)}
`
      )
  }).flat().filter(Boolean)
)


export const runSnapShotTest = (snapShotTests: snapType[]): string => {
  const groupedSnapShots: snapType[][] = groupByPath(snapShotTests)
    
  const snapShotReport: string = groupedSnapShots.map((newSnapshot: snapType[]) => {
    const { path } = newSnapshot[0]
    const oldSnapshot: snapType[] = readSnapShot(path)
    // if oldSnapShot is null, then create new snapshot.

    let message = ''
    console.log({newSnapshot})

    message += writeOnlyNewSnapshot(oldSnapshot, newSnapshot)
    // ここの条件が、おかしいな。
    if (!_.isEqual(oldSnapshot.sort(), newSnapshot.sort())) {
      message += createSnapShotReport(oldSnapshot, newSnapshot)
    }

    return message
  }).flat().filter(Boolean).join('\n')

  return snapShotReport + 'To update snapshot run assertz -u'
}

// TODO: 新しくファイルを作成する時の考慮が抜けている。
export const writeOnlyNewSnapshot = (oldSnapShot: snapType[], newSnapshot: snapType[]): string => {
  const { path } = newSnapshot[0]
  const newSnapshotNames: string[] = newSnapshot.map(x => x.testName).filter(x => !oldSnapShot.map(x => x.testName).includes(x))

  if (newSnapshotNames.length === 0) return ''

  writeSnapshot(newSnapshot)

  return 'created new snapshot in\n'  + path + '\n' + newSnapshotNames.join('\n') + '\n'
}

// 上記のパターンは、３種類
// 既存のnameに存在しないsnapshotが出来ている。
// ⇨ 新しいsnapshotを書き込む。
// その後、
// if(既存のjsonとtestNameが同じだが、内容が違う) {
// ⇨ 警告を出す。
// else {既存のjsonとtestNameが同じだし、内容も同じ
// ⇨ noop

export const readSnapShot = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(createSnapshotPath(path), 'utf8'))
  } catch (e) {
    return []
  }
}


const writeSnapshot = (newSnapShot: snapType[]): void => {
  newSnapShot.sort().forEach(newSS => {
    try {
      fsPath.writeFileSync(createSnapshotPath(newSS.path), JSON.stringify(newSnapShot))
    } catch (e) {
      console.log('error at writeSnapshot')
    }
  })
}

export const createSnapshotPath = (path: string) => {
  const tmp = path.split('/')
  const fileName = tmp.pop()
  const pathWithoutFileName = tmp.join('/')

  return pathWithoutFileName + '/__snapshot__/' + fileName?.replace('.js', '.snap')?.replace('.ts', '.snap')
}

export const groupByPath = (testObject: snapType[]): snapType[][] => {
  const paths = _.sortedUniq(testObject.map(testObj => testObj.path))

  return paths.map((path: any) => testObject.filter((testObj: any) => testObj.path === path))
}

// path毎に分けられた、arrayがinputとして与えられる。それに対して、pathのファイルの中身を読み、updateする必要があれば、
// アップデートする。
export const shouldUpdateSnapShot = (oldSnapshot: string, newSnapshot: string) => (
  oldSnapshot !== newSnapshot
)

export const deepEqual = (a: object, b: object) => (
  JSON.stringify(a) === JSON.stringify(b)
)
