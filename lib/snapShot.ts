const fs = require('fs')

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
  const readSnap = (test: testObjectType) => JSON.parse(fs.readFileSync(test.path + '.snap', 'utf8'))

  try {
    const failureTestName = tests
    // .map(testObj => testObj.testName)
    .filter(
      testObj => !Object.keys(readSnap(testObj)).includes(testObj.testName)
    )
    if (failureTestName.length === 0) {
      console.log('you do not need to update snapshot')
    } else {
      console.log('you need to update snapshot')
    }
  } catch (e) {
    console.log()
    updateSnapShot(tests)
    console.log('created 1 snapShot')
    return []
  }

  return failureTestName
}

// updateSnapShot(tests, path)
const failureTestName = findFailureTest(mockTests)
console.log(failureTestName)

exports.findFailureTest = findFailureTest
