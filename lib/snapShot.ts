const fs = require('fs')
const _ = require('lodash')
const { diffString } = require('json-diff')
import { store } from '../store'
import pipe from '../utils/pipelineOperator'


// interfaceの代わりにtypeを使っておく。
// 厳密には、typeより、interfaceを使った方が良いらしい。

type snapType = {
  testName: string;
  snap: any;
  path: string;
}

type storeType =  ({path: string} | {type: string, testName: string, snap: object})[]

export const updateSnapshot = async (paths: string[]) => {
  for await (const path of paths) {
    store.push({path})
    require(path)
  }

  pipe(store, excludeNotSnapshot, createSnapshotJson).forEach((snapObj: {path: string, snap: object}) => 
    fs.writeFileSync(createSnapShotPath(snapObj.path), JSON.stringify(snapObj.snap))
  )
  console.log('updated snapShot')
}

export const excludeNotSnapshot = (store: any) => {
  // const tmpArr = store.filter((obj: any) => obj.type !== "unitTest")
  // const isSnapshot = tmpArr.filter((obj: any) => obj.type === "snap").length === 0
  // console.log({tmpArr})

  let tmpFileName: string = ''

  const res = store.map((obj: any, index: number) => {
    if (index === store.length && obj.path) {
      return null
    } else if (tmpFileName === '' && obj.path) {
      tmpFileName = obj.path
      return obj
    } else if (obj.type === 'snap') {
      tmpFileName = ''
      return obj
    }
  }).filter(Boolean)
  
  return res
  // return JSON.stringify(res)
  
  // if (isSnapshot) return []
  
  // return tmpArr.filter((obj: any, i: any) => {
  //   if (i === tmpArr.length && obj.path) return false

  //   const isCurrentPath = obj && obj.path
  //   const isNextPath = tmpArr[i + 1] && tmpArr[i + 1].path
    
  //   return isCurrentPath && isNextPath
  // })
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
      // Nameが一致して、かつsnapShotの中身が一致しない場合のみメッセージを表示。
      `Snapshot > ${newSS.testName}
diff:
${diffString(oldSS.snap, newSS.snap)}
`
      )
  }).flat().filter(Boolean)
)


// snapShotのアップデート(完成)
export const runSnapShotTest = (snapShotTests: snapType[]): string => {
  const groupedSnapShots: snapType[][] = groupByPath(snapShotTests)
    
  const snapShotReport: string = groupedSnapShots.map((newSnapShot: snapType[]) => {
    const path: string = newSnapShot[0].path
    const oldSnapShot: snapType[] = readSnapShot(path)
    // undefinedが帰ってきたら、古いsnapshotが存在しないと言うことなので、新規にsnapshotを作成する。
    console.log({oldSnapShot})
    if (oldSnapShot.length === 0) {
      console.log({newSnapShot: JSON.stringify(newSnapShot)})
      writeSnapShot(newSnapShot)
    } else {
      return createSnapShotReport(oldSnapShot, newSnapShot)
    }
    // const isUpdate: boolean = shouldUpdateSnapShot(JSON.stringify(oldSnapShot), JSON.stringify(newSnapShot))    
  }).flat().filter(Boolean).join('\n')
  // console.log({snapShotReport})

  // snapShotReport.forEach((message: any) => console.log(message))
  return snapShotReport + 'To update snapshot run yarn test -u'
}

export const readSnapShot = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(createSnapShotPath(path), 'utf8'))
  } catch (e) {
    return []
  }
}


const writeSnapShot = (newSnapShot: snapType[]): void => {
  newSnapShot.forEach(newSS => {
    try {
      console.log('created snapshot')
      fs.writeFileSync(createSnapShotPath(newSS.path), JSON.stringify(newSnapShot))
    } catch (e) {
      // noop
    }
  })
}

const createSnapShotPath = (path: string) => {
  return path.replace('.js', '.snap').replace('.ts', '.snap')
}

// path毎に分ける
export const groupByPath = (testObject: snapType[]): snapType[][] => {
  // must sort
  const paths = _.sortedUniq(testObject.map(testObj => testObj.path))

  return paths.map((path: any) => testObject.filter((testObj: any) => testObj.path === path))
}

// path毎に分けられた、arrayがinputとして与えられる。それに対して、pathのファイルの中身を読み、updateする必要があれば、
// アップデートする。
export const shouldUpdateSnapShot = (oldSnapHot: string, newSnapShot: string) => {
    const shouldUpdateSnapShot = oldSnapHot !== newSnapShot
    return shouldUpdateSnapShot

    // const existingSnapShotNames = Object.keys(existingSnapShot)
    // const shouldUpdateSnapShot = pathObj.some((obj: any) =>  existingSnapShotNames.includes(obj.path))
   
    // もしアップデートが必要な場合、
    // if (shouldUpdateSnapShot) updateSnapShot(path, JSON.stringify(testArray))
  
}

export const deepEqual = (a: object, b: object) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

// updateSnapShot(tests, path)
// const failureTestName = findFailureTest(mockTests)
// console.log(failureTestName)

// exports.findFailureTest = findFailureTest

