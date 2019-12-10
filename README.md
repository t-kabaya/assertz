# Don't use assertz.
# Developing

<img src="https://user-images.githubusercontent.com/26253721/66712469-fa9f3480-edd7-11e9-9b6d-f3e9b2c4264b.png" alt="alt text" width="400" height="400">

assertz is super simple test library.
Do we need toBeTruthy or toBeOdd?
I need just one matcher like node.js's assert.

assertz offer only one matcher.


# Getting Started
Install assertz using yarn:

```
yarn add --dev git+https://git@github.com/t-kabaya/assertz.git
```
Or npm:

```
npm install --save-dev git+https://git@github.com/t-kabaya/assertz.git
```

Let's get started by writing a test for a function that adds two numbers. First, create a sum.js file:

``` js
const sum = (a, b) => {
  return a + b;
}
module.exports = sum
```

Then, create a file named sum.test.js.
CAUTION: Test file must ends with *.test.js

``` js
const assert = require('assertz')
const sum = require('./sum')

// adds 1 + 1 to equal 2
assert(sum(1, 1), 2, 'adds 1 + 1 to equal 2')
```

Add the following section to your package.json:

```json
{
  "scripts": {
    "test": "assertz"
  }
}
```
Finally, run

```
yarn test
```

or

```
npm run test 
```
and assertz will print this message:

```
sum.test.js
Difference:

- 4
+ 2
```

# Snapshot testing

assertz supports snapshot testing, [as introduced by Jest](https://facebook.github.io/jest/docs/snapshot-testing.html), through its [Assertions](./03-assertions.md) interface. You can snapshot any value as well as React elements:

```js
// Your component
const HelloWorld = () => <h1>Hello World...!</h1>;

export default HelloWorld;
```

```js
// Your test
import { snap } from 'ava';
import render from 'react-test-renderer';
import HelloWorld from '.';

{
  const tree = render.create(<HelloWorld/>).toJSON();
  snap(tree, 'HelloWorld component');
}

```

Say you have `~/project/test/main.test.js` which contains snapshot assertions. assertz will create a file:

* `~/project/test/snapshots/main.test.snap`

The file contains the actual snapshot and is required for future comparisons. 

You can then check your code. If the change was intentional you can use the `--update` (or `-u`) flag to update the snapshots:

```console
$ assertz --update
```

The snapshot files will be saved in a directory structure that mirrors that of your test files.
