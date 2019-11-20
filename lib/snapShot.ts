const fs = require('fs')
const _ = require('lodash')

// interfaceの代わりにtypeを使っておく。
// 厳密には、typeより、interfaceを使った方が良いらしい。

type testObjectType = {
  testName: string;
  snap: any;
  path: string;
}

const mockTests: testObjectType[] = [
  {
    testName: 'some snap',
    snap: { foo: 'foo' },
    path: './message.txt'
  },
  {
    testName: 'nice snap',
    snap: 777,
    path: './message.txt'
  }
]

// snapShotのアップデート(完成)
export const updateSnapShot = (tests: testObjectType[]) => {
  const snap: any = {}
  console.log(tests)
  tests.forEach(test => {
    snap[test.testName] = JSON.stringify(test.snap)
    console.log(snap)

    // test.js.snapという末尾になっている。.jsぐらいは取り除いた方が良いかな？
    fs.writeFileSync(test.path + '.snap', JSON.stringify(snap))
  })
}

// snapShotを更新する必要があるかを判断
export const findFailureTest = (tests: testObjectType[]): any[] => {
  // utf8を指定しないと、bufferが帰ってくる。
    const failureTestName = tests
    // .map(testObj => testObj.testName)
    .filter(
      testObj => !Object.keys(readSnapShot(testObj.path)).includes(testObj.testName)
    )
    if (failureTestName.length === 0) {
      console.log('you do not need to update snapshot')
    } else {
      console.log('you need to update snapshot')
    }

  return failureTestName
}

export const readSnapShot = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(path + '.snap', 'utf8'))
  } catch (e) {
    return {}
  }
}


// path毎に分ける。
export const groupByPath = (testObject: testObjectType[]) => {
  const paths = _.sortedUniq(testObject.map(testObj => testObj.path))
  // return paths

  return paths.map((path: any) => testObject.filter((testObj: any) => testObj.path === path))
  // _.groupBy(testObject, )
  // return true
}

// updateSnapShot(tests, path)
const failureTestName = findFailureTest(mockTests)
console.log(failureTestName)

exports.findFailureTest = findFailureTest
