const fs = require('fs')
const _ = require('lodash')

// interfaceの代わりにtypeを使っておく。
// 厳密には、typeより、interfaceを使った方が良いらしい。

type testObjectType = {
  testName: string;
  snap: any;
  path: string;
}

const snapShotStore = []

// const mockTests: testObjectType[] = [
//   {
//     testName: 'some snap',
//     snap: { foo: 'foo' },
//     path: './message.txt'
//   },
//   {
//     testName: 'nice snap',
//     snap: 777,
//     path: './message.txt'
//   }
// ]

export const updateSnapShot = (path: string, snapShot: any) => {
  const stringifiedSnapShot = JSON.stringify(snapShot)
  fs.writeFileSync(path + ".snap", stringifiedSnapShot)
  console.log('update snapShot')
}

export const createSnapShotReport = (oldSnapShot: testObjectType[], newSnapShot: testObjectType[]) => {
  // const report = ''
  const reportStrings: string[][] = newSnapShot.map((new: any) => 
    oldSnapShot.filter(old => old.testName === new.testName ).map(obj => obj.testName)
    // return diff
  )
  // TODO: 関数型の書き方では、ここでconsole.logするべきではない。
  console.log(reportStrings)
}

// snapShotのアップデート(完成)
export const runSnapShotTest = (snapShotTests: testObjectType[]) => {
  const groupedSnapShots = groupByPath(snapShotTests)
  // console.log({groupedSnapShots});
  
  
  groupedSnapShots.forEach((snapShot: any) => {
    const path: string = snapShotTests[0].path
    const oldSnapShot: testObjectType[] = readSnapShot(path)
    const isUpdate: boolean = shouldUpdateSnapShot(JSON.stringify(oldSnapShot), JSON.stringify(snapShot))

    console.log({oldSnapShot});
    console.log({snapShot});
    
    console.log({isUpdate})
    
    if (isUpdate) {
      createSnapShotReport(oldSnapShot, snapShot)
      updateSnapShot(path, snapShot)
    }
  })
  console.log('finish snapShot test')
}

// TODO: findFailureTestを削除する。
// export const findFailureTest = (tests: testObjectType[]): any[] => {
//   // utf8を指定しないと、bufferが帰ってくる。
//     const failureTestName = tests
//     // .map(testObj => testObj.testName)
//     .filter(
//       testObj => !Object.keys(readSnapShot(testObj.path)).includes(testObj.testName)
//     )
//     if (failureTestName.length === 0) {
//       console.log('you do not need to update snapshot')
//     } else {
//       console.log('you need to update snapshot')
//     }

//   return failureTestName
// }

export const readSnapShot = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(path + '.snap', 'utf8'))
  } catch (e) {
    return {}
  }
}


// path毎に分ける
export const groupByPath = (testObject: testObjectType[]) => {
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
