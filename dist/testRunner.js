"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var fs = require("fs");
var _ = require("lodash");
var store_1 = require("./store");
var createTestFailureMessage_1 = require("./createTestFailureMessage");
var createSummary_1 = require("./lib/createSummary");
var pipelineOperator_1 = require("./utils/pipelineOperator");
var logUtils_1 = require("./utils/logUtils");
// interface testStatusType {
//   fileName: string;
//   testStatus: ;
// }
exports.runTests = function (paths) { var paths_1, paths_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var path, e_1_1, reducer, testResult;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 11]);
                paths_1 = __asyncValues(paths);
                _b.label = 1;
            case 1: return [4 /*yield*/, paths_1.next()];
            case 2:
                if (!(paths_1_1 = _b.sent(), !paths_1_1.done)) return [3 /*break*/, 4];
                path = paths_1_1.value;
                store_1.store.push({ fileName: path });
                require(path);
                _b.label = 3;
            case 3: return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 11];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 11];
            case 6:
                _b.trys.push([6, , 9, 10]);
                if (!(paths_1_1 && !paths_1_1.done && (_a = paths_1["return"]))) return [3 /*break*/, 8];
                return [4 /*yield*/, _a.call(paths_1)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 10: return [7 /*endfinally*/];
            case 11:
                reducer = function (acc, val) {
                    if (val.fileName) {
                        // ファイルネームを一時的にセット
                        acc.fileName = val.fileName;
                        return acc;
                    }
                    if (_.isEqual(val.received, val.expected)) {
                        // テスト成功
                        acc.successCount += 1;
                        return acc;
                    }
                    // テスト失敗
                    acc.failureCount += 1;
                    var failureMessage = createTestFailureMessage_1.createTestFailureMessage(val.testName, val.received, val.expected, acc.fileName.replace(/.+\//, ''));
                    logUtils_1["default"](failureMessage);
                    return acc;
                };
                testResult = store_1.store.reduce(reducer, { fileName: '', successCount: 0, failureCount: 0 });
                /* -------------------- show summary --------------------- */
                pipelineOperator_1["default"](testResult, createSummary_1.createSummary, logUtils_1["default"]);
                return [2 /*return*/];
        }
    });
}); };
exports.findTests = function (dir) {
    var testPath = [];
    var walk = function (dir) {
        var files = fs.readdirSync(dir);
        files
            // test.jsで終わるファイルを、テストファイルと見なす。
            .filter(function (f) { return f.endsWith('.test.js') || f.endsWith('.test.ts'); })
            .map(function (file) { return '/' + dir + '/' + file; })
            .forEach(function (files) { return testPath.push(files); });
        files
            // .gitと、node_modulesは、エラーを引き起こすので、除外する。
            .filter(function (f) { return f !== '.git'; })
            .filter(function (f) { return f !== 'node_modules'; })
            // フォルダのみ次へ
            .filter(function (file) {
            var stat = fs.statSync(dir + '/' + file);
            if (!stat)
                return false;
            return stat.isDirectory();
        })
            .forEach(function (childDir) { return walk(dir + '/' + childDir); });
    };
    walk(dir);
    return testPath;
};
