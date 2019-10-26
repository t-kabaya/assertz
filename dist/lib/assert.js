"use strict";
exports.__esModule = true;
var store_1 = require("../store");
exports.assert = function (testName, received, expected) {
    store_1.store.push({ testName: testName, received: received, expected: expected });
};
