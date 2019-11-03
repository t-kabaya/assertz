"use strict";
exports.__esModule = true;
var store_1 = require("./store");
var assert = function (received, expected, testName) {
    store_1.store.push({ received: received, expected: expected, testName: testName });
};
module.exports = assert;
