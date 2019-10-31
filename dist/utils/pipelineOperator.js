"use strict";
exports.__esModule = true;
var pipe = function (input) {
    var methods = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        methods[_i - 1] = arguments[_i];
    }
    return methods.reduce(function (ac, cv) { return cv(ac); }, input);
};
exports["default"] = pipe;
