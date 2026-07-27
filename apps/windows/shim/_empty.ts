// @ts-nocheck
const noop = function () { return module.exports; };
noop.__esModule = true;
noop.default = noop;
const handler = { get: function () { return noop; }, apply: function () { return module.exports; } };
const proxy = function () { return module.exports; };
module.exports = new Proxy(proxy, handler);
