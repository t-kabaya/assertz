const fs = require('fs')
const _ = require('lodash')

// interfaceの代わりにtypeを使っておく。
// 厳密には、typeより、interfaceを使った方が良いらしい。

type snapType = {
  testName: string;
  snap: any;
  path: string;
}

export const updateSnapShot = (path: string, snapShot: any) => {
  const stringifiedSnapShot = JSON.stringify(snapShot)
  fs.writeFileSync(path + ".snap", stringifiedSnapShot)
  console.log('update snapShot')
}

export const createSnapShotReport = (oldSnapShot: snapType[], newSnapShot: snapType[]): (string | undefined)[] => (
  newSnapShot.map(newSS => {
    oldSnapShot
    .map(oldSS => {
      // testNameが一致して、かつsnapShotの中身が一致しない場合のみメッセージを表示。
      if (oldSS.testName === newSS.testName && oldSS.snap !== newSS.snap) return `Snapshot > ${newSS.testName}
- SnapShot
+ Received
- ${oldSS.snap}
+ ${newSS.snap}
`
    })}).flat().filter(Boolean)
  // filter(Boolean)で、undefinedを取り除く。
)

// snapShotのアップデート(完成)
export const runSnapShotTest = (snapShotTests: snapType[]): string => {
  const groupedSnapShots: snapType[][] = groupByPath(snapShotTests)
  console.log({groupedSnapShots: JSON.stringify(groupedSnapShots)})
  // console.log({groupedSnapShots});
  
  
  const snapShotReport: any = groupedSnapShots.map((newSnapShot: snapType[]) => {
    const path: string = newSnapShot[0].path
    const oldSnapShot: snapType[] = readSnapShot(path)
    // undefinedが帰ってきたら、古いsnapshotが存在しないと言うことなので、新規にsnapshotを作成する。
    console.log({oldSnapShot})
    if (oldSnapShot.length === 0) {
      console.log({newSnapShot: JSON.stringify(newSnapShot)})
      writeSnapShot(newSnapShot)
    } else {
      console.log('something wrong')
      return createSnapShotReport(oldSnapShot, newSnapShot)
    }
    // const isUpdate: boolean = shouldUpdateSnapShot(JSON.stringify(oldSnapShot), JSON.stringify(newSnapShot))    
  }).flat().filter(Boolean).join('\n')
  // console.log({snapShotReport})

  // snapShotReport.forEach((message: any) => console.log(message))
  return snapShotReport
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

// updateSnapShot(tests, path)
// const failureTestName = findFailureTest(mockTests)
// console.log(failureTestName)

// exports.findFailureTest = findFailureTest
