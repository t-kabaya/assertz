const test: any = require('ava')
const { updateSnapShot, findFailureTest, readSnapShot, groupByPath } = require('../lib/snapShot')
const fs = require('fs')
const sinon = require('sinon')

// もしファイルが存在しなければ、空のオブジェクトを返す事。
test('readSnap: if file does not exist, then return blank object', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns(new Error())

  const output = readSnapShot('./README.md')
  t.deepEqual(output, {})
  sinon.restore()
})

// もしファイルの中身がjsonなら、jsオブジェクトを返す事。
test('readSnap: if fileContent is json, then return js objcet', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')
  
  const output = readSnapShot('./README.md')
  t.deepEqual(output, {foo: 777})
  sinon.restore()
})

/*----------------------------------------- groupByPath --------------------------------------------------*/

// もしファイルが存在しなければ、空のオブジェクトを返す事。
test('groupByPath: must return nested array', (t: any) => {
  const input = [
    {
      testName: 'some snap',
      snap: { foo: 'foo' },
      path: './foo.snap'
    },
    {
      testName: 'nice snap',
      snap: 777,
      path: './foo.snap'
    },
    {
      testName: 'some snap',
      snap: { bar: 'bar' },
      path: './bar.snap'
    },
    {
      testName: 'nice snap',
      snap: 777,
      path: './bar.snap'
    }
  ]

  const expected = [
    [
      {
        testName: 'some snap',
        snap: { foo: 'foo' },
        path: './foo.snap'
      },
      {
        testName: 'nice snap',
        snap: 777,
        path: './foo.snap'
      },
    ],
    [
      {
        testName: 'some snap',
        snap: { bar: 'bar' },
        path: './bar.snap'
      },
      {
        testName: 'nice snap',
        snap: 777,
        path: './bar.snap'
      }
    ]
  ]

  const output = groupByPath(input)
  t.deepEqual(output, expected)
})
