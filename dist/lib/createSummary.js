"use strict";
exports.__esModule = true;
var chalk = require("chalk");
// TODO: fix chalk as any
exports.createSuccessMessage = function (successCount) {
    return chalk.green(successCount + " test passed\n");
};
exports.createFailureMessage = function (failureCount) {
    return chalk.red(failureCount + " tests failed\n");
};
exports.createSummary = function (_a) {
    var successCount = _a.successCount, failureCount = _a.failureCount;
    return failureCount > 0
        ? exports.createFailureMessage(failureCount)
        : exports.createSuccessMessage(successCount);
};
