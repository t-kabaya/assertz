"use strict";
exports.__esModule = true;
var chalk = require('chalk');
exports.createTestFailureMessage = function (testName, received, expected, fileName) { return ('-----------------------------------------------------\n\n' +
    chalk.white(testName) +
    ' < ' +
    chalk.blue(fileName) +
    '\n\n' +
    'received:\n' +
    chalk.red(JSON.stringify(received)) +
    '\n' +
    'expected:\n' +
    chalk.green(JSON.stringify(expected)) +
    '\n'); };
