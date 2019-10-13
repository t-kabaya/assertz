## Caution
Developing now!
Don't use yet.

## 概要

jestは複雑すぎる。
helloUnitTestはシンプルな、マッチャーが１つしかないテストフレームワークです。

開発中です。

# Getting Started
Install assertz using yarn:

yarn add --dev assertz
Or npm:

npm install --save-dev assertz

Let's get started by writing a test for a function that adds two numbers. First, create a sum.js file:

``` js
const sum = (a, b) => {
  return a + b;
}
module.exports = sum
```

Then, create a file named sum.test.js. Test file must ends with *.test.js

``` js
const assert = require('assertz')
const sum = require('./sum')

// adds 1 + 2 to equal 3
assert(sum(1, 2), 3)
```

Add the following section to your package.json:

{
  "scripts": {
    "test": "assertz"
  }
}
Finally, run yarn test or npm run test and assertz will print this message:

PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)