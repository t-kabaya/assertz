## 概要

jestは複雑すぎる。
helloUnitTestはシンプルな、マッチャーが１つしかないテストフレームワークです。

開発中です。

# example

``` js
const assert = require('helloSimpleTest');

const sum = (a, b) => {
  return a + b
}

// 1 + 1 must be 2
assert(sum(1, 1), 2)
```

# run
node ./node_modules/helloSimpleTest/cli.js