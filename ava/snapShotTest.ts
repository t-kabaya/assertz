const fs = require('fs')
const sinon = require('sinon')
const test: any = require('ava')
import {UNIT_TEST, SNAP} from '../index'
const { deepEqual } = require('./avaUtils')
const { diffString } = require('json-diff')
const { readSnapShot, groupByPath, shouldUpdateSnapShot, createSnapShotReport, createSnapshotJson, excludeNotSnapshot,  createSnapshotPath } = require('../lib/snapShot')
// import * as snapShot from '../lib/snapShot'

/*----------------------------------------- readSnapShot --------------------------------------------*/

// もしファイルが存在しなければ、空の配列を返す事。
test('readSnap: if file does not exist, then return blank array', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns(new Error())

  const output = readSnapShot('./README.md')
  deepEqual(t, output, [])
  sinon.restore()
})

// もしファイルの中身がjsonなら、jsオブジェクトを返す事。
test('readSnap: if fileContent is json, then return js objcet', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')

  const output = readSnapShot('./README.md')
  deepEqual(t, output, {foo: 777})
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
  deepEqual(t, output, expected)
})

/*---------------------------------- maybeUpdateSnapShot ------------------------------------*/

// 古いsnapShotと、新しいsnapShotが異なる場合、trueを返さなくてはならない。
test('shouldUpdateSnapShot: if old snapShot and new snapShot is different, then return true', (t: any) => {
  const oldSnapShot =
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
    ]

  const newSnapShot = [
    {
      testName: 'some snap',
      snap: { bar: 'foo' },
      path: './bar.snap'
    },
    {
      testName: 'nice snap',
      snap: 777,
      path: './bar.snap'
    },
  ]

  // sinon.stub(updateSnapShot, 'readFileSync').returns(new Error())

  const output = shouldUpdateSnapShot(JSON.stringify(oldSnapShot), JSON.stringify(newSnapShot))
  deepEqual(t, output, true)
  // sinon.restore()
})

/*----------------------------------- runSnapShotTest ------------------------------------------*/


test('runSnapShotTest: ', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')

  const output = readSnapShot('./README.md')
  deepEqual(t, output, {foo: 777})
  sinon.restore()
})


/*------------------------------------- createSnapShotReport --------------------------------------------*/

test('createSnapShotReport: must match object', (t: any) => {
  const oldSnapShot = [{
    testName: 'baz',
    snap: {
      foo: "foo"
    },
    path: './'
  }]
  const newSnapShot = [{
    testName: 'baz',
    snap: {
      bar: "bar"
    },
    path: './'
  }]
  const testName = 'baz'

  const expected = [`Snapshot > ${testName}
diff:
${diffString({foo: 'foo'}, {bar: 'bar'})}
`]

  const actual = createSnapShotReport(oldSnapShot, newSnapShot)
  // console.log({expected})
  // console.log({actual})

  deepEqual(t, actual, expected)
})

test('createSnapShotReport: do not detect no change snapshot', (t: any) => {
  const oldSnapShot = [{
    testName: 'baz',
    snap: {
      foo: "foo"
    },
    path: './'
  }]

  const newSnapShot = [{
    testName: 'baz',
    snap: {
      foo: "foo"
    },
    path: './'
  }]

  const actual = createSnapShotReport(oldSnapShot, newSnapShot)
  // console.log({expected})
  // console.log({actual})
  deepEqual(t, actual, [])
})

test('createSnapShotReport: must match two object', (t: any) => {
  const oldSnapShot = [
    {
      testName: 'baz',
      snap: {
        foo: "foo"
      },
      path: './'
    },
    {
      testName: 'notMatch',
      snap: 666,
      path: './'
    }
  ]
  const newSnapShot = [
    {
      testName: 'baz',
      snap: {
        bar: "bar"
      },
      path: './'
    }
  ]
  const testName = 'baz'

  const expected = [`Snapshot > ${testName}
diff:
${diffString({foo: 'foo'}, {bar: 'bar'})}
`]

  const actual = createSnapShotReport(oldSnapShot, newSnapShot)
  // console.log({actual})
  // console.log({expected})

  deepEqual(t, actual, expected)
})

// TODO: delete this test. this is example of stub standalone function
// test('sinon stubing example', (t: any) => {
//   console.log(runSnapShotTest)

//   sinon.stub(snapShot, 'readSnapShot').returns('read snapShot')


//   const actual = snapShot.readSnapShot('oo')

//   deepEqual(t, actual, [])
// })

/*------------------------------- updateSnapshotTest -----------------------------------*/

test('updateSnapShot: ', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')

  const output = readSnapShot('./README.md')
  deepEqual(t, output, {foo: 777})
  sinon.restore()
})


/*--------------------------------- createSnapshotJson ---------------------------------------------*/

test('createSnapshotJson: must return valid value', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: SNAP, testName: 'foo1', snap: "foo"},
    {type: SNAP, testName: 'foo2', snap: "foo"},
    {path: 'bar'},
    {type: SNAP, testName: 'bar1', snap: "bar"},
    {type: SNAP, testName: 'bar2', snap: "bar"},
  ]

  const expected = [
    {path: 'foo', snap: {"foo1": "foo", "foo2": "foo"}},
    {path: 'bar', snap: {"bar1": "bar", "bar2": "bar"}}
  ]

  const actual = createSnapshotJson(input)

  deepEqual(t, actual, expected)
})

test('createSnapshotJson: must return blank array', (t: any) => {
  const input: any[] = []

  const expected: any[] = []

  const actual = createSnapshotJson(input)

  deepEqual(t, actual, expected)
})

/*------------------------------- excludeNotSnapshot ----------------------------------*/


test('excludeNotSnapshot: must return valid value', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: UNIT_TEST, testName: 'foo1', expected: '777', received: '888'},
    {path: 'bar'},
    {type: UNIT_TEST, testName: 'foo1', expected: '777', received: '888'},
    {type: SNAP, testName: 'bar1', snap: "bar"},
]

  const expected = [
    {path: 'bar'},
    {type: SNAP, testName: 'bar1', snap: "bar"},
  ]

  const actual = excludeNotSnapshot(input)

  deepEqual(t, actual, expected)
})

test('excludeNotSnapshot: must return blank', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: UNIT_TEST, testName: 'foo1', expected: '777', received: '888'},
  ]

  const expected: any = []

  const actual = excludeNotSnapshot(input)

  deepEqual(t, actual, expected)
})

// test('excludeNotSnapshot: path object after snap object return type', (t: any) => {
//   const input = [
//     {path: 'bar'},
//     {type: SNAP, testName: 'bar1', snap: "bar"},
//     {path: 'foo'},
//   ]

//   const expected: any = [
//     {path: 'bar'},
//     {type: SNAP, testName: 'bar1', snap: "bar"},
//   ]

//   const actual = excludeNotSnapshot(input)

//   deepEqual(t, actual, expected)
// })

/*------------------------------- createSnapshotPath ----------------------------------*/

test('createSnapshotPath: must return correct value', (t: any) => {
  const input = './test/foo.test.js'

  const expected = './test/__snapshot__/foo.test.snap'

  const actual = createSnapshotPath(input)

  t.deepEqual(actual, expected)
})



