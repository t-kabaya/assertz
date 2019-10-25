var fs = require('fs');
var fileContent = require('fs')
    .readFileSync('README.md')
    .toString()
    .split('\n')
    .map(function (text, index) { return index + ": " + text; })
    .join('\n');
var readFileAsArray = function (path) {
    return fs
        .readFileSync(path)
        .toString()
        .split('\n');
};
var getTestNameAndAssert = function (path) {
    var fileContent = readFileAsArray(path);
    return { testName: 'foo', assert: 'assert' };
};
module.exports = { readFileAsArray: readFileAsArray, getTestNameAndAssert: getTestNameAndAssert };
