var testResultStore = require('./store').testResultStore;
var showTestResult = function () {
    console.log('show Test Result');
    console.log(testResultStore);
    testResultStore.forEach(function (result) { return console.log('result' + result); });
    // テストが終了したら、storeの初期化をする。
    // store = []
};
module.exports = showTestResult;
