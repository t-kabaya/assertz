"use strict";
exports.__esModule = true;
var testRunner_1 = require("./testRunner");
var env_1 = require("./env");
var root = env_1.NODE_ENV === 'development'
    ? __dirname
    : __dirname.replace('/node_modules/assertz', '');
var paths = testRunner_1.findTests(root);
testRunner_1.runTests(paths);
