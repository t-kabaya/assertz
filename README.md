## Caution
Developing now!
Don't use yet.

![logo](https://user-images.githubusercontent.com/26253721/66712469-fa9f3480-edd7-11e9-9b6d-f3e9b2c4264b.png)
<img src="https://user-images.githubusercontent.com/26253721/66712469-fa9f3480-edd7-11e9-9b6d-f3e9b2c4264b.png" alt="alt text" width="400" height="400">

![test image size](https://user-images.githubusercontent.com/26253721/66712469-fa9f3480-edd7-11e9-9b6d-f3e9b2c4264b.png){:height="50%" width="50%"}



assertz is super simple test library.
Do we need toBeTruthy or toBeOdd?
I need just one matcher like node.js's assert.

assertz offer only one matcher.


# Getting Started
Install assertz using yarn:

```
yarn add --dev assertz
```
Or npm:

```
npm install --save-dev assertz
```

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

// adds 1 + 1 to equal 4
assert(sum(1, 1), 4)
```

Add the following section to your package.json:

```json
{
  "scripts": {
    "test": "node ./node_modules/assertz/index.js"
  }
}
```
Finally, run yarn test or npm run test and assertz will print this message:

```
sum.test.js
Difference:

- 4
+ 2
```