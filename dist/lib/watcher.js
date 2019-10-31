"use strict";
exports.__esModule = true;
var fs = require("fs");
var lodash_1 = require("lodash");
exports.watcher = function (runTests, path, root) {
    fs.watch(root, { recursive: true }, function (event, filename) {
        if (!filename || event != 'change')
            return;
        var throttle_runTests = lodash_1.throttle(runTests, 1000);
        throttle_runTests(path);
    });
};
