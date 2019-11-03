"use strict";
exports.__esModule = true;
exports.NODE_ENV = process.env.NODE_ENV || '';
exports.ROOT_FOLDER = exports.NODE_ENV === 'development'
    ? __dirname
    : __dirname.replace('/node_modules/assertz/dist', '');
