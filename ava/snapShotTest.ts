const fs = require('fs')
const sinon = require('sinon')
const test: any = require('ava')
const { deepEqual } = require('./avaUtils')
const { diffString } = require('json-diff')
const { readSnapShot, groupByPath, shouldUpdateSnapShot, createSnapShotReport, createSnapshotJson, excludeNotSnapshot } = require('../lib/snapShot')
// import * as snapShot from '../lib/snapShot'

/*----------------------------------------- readSnapShot --------------------------------------------*/

// もしファイルが存在しなければ、空の配列を返す事。
test('readSnap: if file does not exist, then return blank array', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns(new Error())

  const output = readSnapShot('./README.md')
  t.deepEqual(output, [])
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
  t.deepEqual(output, true)
  // sinon.restore()
})

/*----------------------------------- runSnapShotTest ------------------------------------------*/


test('runSnapShotTest: ', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')
  
  const output = readSnapShot('./README.md')
  t.deepEqual(output, {foo: 777})
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

  t.deepEqual(actual, expected)
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
  t.deepEqual(actual, [])
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

  t.deepEqual(actual, expected)
})

// TODO: delete this test. this is example of stub standalone function
// test('sinon stubing example', (t: any) => {
//   console.log(runSnapShotTest)

//   sinon.stub(snapShot, 'readSnapShot').returns('read snapShot')


//   const actual = snapShot.readSnapShot('oo')

//   t.deepEqual(actual, [])
// })

/*------------------------------- updateSnapshotTest -----------------------------------*/

test('updateSnapShot: ', (t: any) => {
  sinon.stub(fs, 'readFileSync').returns('{"foo": 777}')
  
  const output = readSnapShot('./README.md')
  t.deepEqual(output, {foo: 777})
  sinon.restore()
})


/*--------------------------------- createSnapshotJson ---------------------------------------------*/

test('createSnapshotJson: must return valid value', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: 'snap', testName: 'foo1', snap: "foo"},
    {type: 'snap', testName: 'foo2', snap: "foo"}, 
    {path: 'bar'},
    {type: 'snap', testName: 'bar1', snap: "bar"},
    {type: 'snap', testName: 'bar2', snap: "bar"},
  ]

  const expected = [
    {path: 'foo', snap: {"foo1": "foo", "foo2": "foo"}},
    {path: 'bar', snap: {"bar1": "bar", "bar2": "bar"}}
  ]

  const actual = createSnapshotJson(input)
  
  t.deepEqual(actual, expected)
})

test('createSnapshotJson: must return blank array', (t: any) => {
  const input: any[] = []

  const expected: any[] = []

  const actual = createSnapshotJson(input)
  
  t.deepEqual(actual, expected)
})

/*------------------------------- excludeNotSnapshot ----------------------------------*/


test('excludeNotSnapshot: must return valid value', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: 'unitTest', testName: 'foo1', expected: '777', received: '888'},
    {path: 'bar'},
    {type: 'unitTest', testName: 'foo1', expected: '777', received: '888'},
    {type: 'snap', testName: 'bar1', snap: "bar"},
  ]

  const expected = [
    {path: 'bar'},
    {type: 'snap', testName: 'bar1', snap: "bar"},
  ]

  const actual = excludeNotSnapshot(input)
  
  t.deepEqual(actual, expected)
})

test('excludeNotSnapshot: must return blank', (t: any) => {
  const input = [
    {path: 'foo'},
    {type: 'unitTest', testName: 'foo1', expected: '777', received: '888'},
  ]

  const expected: any = []

  const actual = excludeNotSnapshot(input)
  
  t.deepEqual(actual, expected)
})

test('excludeNotSnapshot: path object after snap object return type', (t: any) => {
  const input = [
    {path: 'bar'},
    {type: 'snap', testName: 'bar1', snap: "bar"},
    {path: 'foo'},
  ]

  const expected: any = [
    {path: 'bar'},
    {type: 'snap', testName: 'bar1', snap: "bar"},
  ]

  const actual = excludeNotSnapshot(input)
  
  deepEqual(t, actual, expected)
})
