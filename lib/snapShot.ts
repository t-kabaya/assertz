const fs = require('fs')

const tests = [
  {
    testName: 'some snap',
    snapData: { foo: 'foo' }
  },
  {
    testName: 'nice snap',
    snapData: 777
  }
]

const path = './message.txt'

// snapShotのアップデート(完成)
const updateSnapShot = (tests, path, testName) => {
  const snap = {}
  tests.forEach(test => (snap[test.testName] = JSON.stringify(test.snapData)))
  fs.writeFileSync(path, JSON.stringify(snap))
}

// snapShotを更新する必要があるかを判断
const findFailureTest = (tests, path) => {
  // utf8を指定しないと、bufferが帰ってくる。
  const snap = JSON.parse(fs.readFileSync(path, 'utf8'))
  console.log(snap)
  console.log(Object.keys(snap))

  const failureTestName = tests
    .map(testObj => testObj.testName)
    .filter(testName => !Object.keys(snap).includes(testName))
  if (failureTestName.length === 0) {
    console.log('snap shot に変化はありません')
  } else {
    console.log('updateしてください。')
  }

  return failureTestName
}

// updateSnapShot(tests, path)
const failureTestName = findFailureTest(tests, path)
console.log(failureTestName)
