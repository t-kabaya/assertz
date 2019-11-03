#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var commander = require("commander");
var fs = require("fs");
var testRunner_1 = require("./testRunner");
var env_1 = require("./env");
commander
    .option('-d, --debug', 'output extra debugging')
    .option('-w, --watch', 'watch mode');
commander.parse(process.argv);
var paths = testRunner_1.findTests(env_1.ROOT_FOLDER);
var throttle_runTest = lodash_1.throttle(testRunner_1.runTests, 1000);
if (commander.watch) {
    throttle_runTest(paths);
    fs.watch(env_1.ROOT_FOLDER, { recursive: true }, function (_a, filename) {
        if (!filename)
            return;
        throttle_runTest(paths);
    });
}
else {
    throttle_runTest(paths);
}
