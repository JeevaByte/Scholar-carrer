"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_js_1 = require("../dist/app.js");
// Vercel serverless entrypoint: export the Express request handler directly.
exports.default = app_js_1.app;
