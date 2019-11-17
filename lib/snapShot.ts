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

// updatesするかどうかを判断 readSnapShotという命名は、よろしくない。
const maybeUpdateSnapShot = (tests, path) => {
  // utf8を指定しないと、bufferが帰ってくる。
  const snap = JSON.parse(fs.readFileSync(path, 'utf8'))
  console.log(snap)
  console.log(Object.keys(snap))

  const diff = tests.filter(test => !Object.keys(snap).includes(test.testName))
  if (diff.length === 0) {
    console.log('snap shot は成功です。')
  } else {
    console.log('updateしてください。')
  }
  console.log(diff)
}

// updateSnapShot(tests, path)
maybeUpdateSnapShot(tests, path)
