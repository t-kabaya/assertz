import * as fs from 'fs'
import * as _ from 'lodash'
const { diffString } = require('json-diff')
import { store } from './store'
import pipe from '../utils/pipelineOperator'

// use type instead of interface, because type is enough for my purpose.
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
  const tmpArr = store.filter((obj: any) => obj.type !== "unitTest")
  const isSnapshot = tmpArr.filter((obj: any) => obj.type === "snap").length === 0
  
  if (isSnapshot) return []
  
  return tmpArr.filter((obj: any, i: any) => {
    if (i === tmpArr.length) return true
    
    return !(obj && obj.path && tmpArr[i + 1] && tmpArr[i + 1].path)
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
    
  const snapShotReport: string = groupedSnapShots.map((newSnapShot: snapType[]) => {
    const path: string = newSnapShot[0].path
    const oldSnapShot: snapType[] = readSnapShot(path)
    // if oldSnapShot is null, then create new snapshot.
    if (oldSnapShot.length === 0) {
      writeSnapShot(newSnapShot)
    } else {
      return createSnapShotReport(oldSnapShot, newSnapShot)
    }
  }).flat().filter(Boolean).join('\n')

  return snapShotReport + 'To update snapshot run assertz -u'
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

const createSnapShotPath = (path: string) => (
  path.replace('.js', '.snap').replace('.ts', '.snap')
)

export const groupByPath = (testObject: snapType[]): snapType[][] => {
  const paths = _.sortedUniq(testObject.map(testObj => testObj.path))

  return paths.map((path: any) => testObject.filter((testObj: any) => testObj.path === path))
}

// path毎に分けられた、arrayがinputとして与えられる。それに対して、pathのファイルの中身を読み、updateする必要があれば、
// アップデートする。
export const shouldUpdateSnapShot = (oldSnapHot: string, newSnapShot: string) => (
  oldSnapHot !== newSnapShot
)

export const deepEqual = (a: object, b: object) => (
  JSON.stringify(a) === JSON.stringify(b)
)
