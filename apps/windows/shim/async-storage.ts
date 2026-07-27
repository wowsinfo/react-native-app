// @ts-nocheck
var store = {};
var AsyncStorage = {
  getItem: function (key, cb) {
    var v = store[key] != null ? store[key] : null;
    if (cb) cb(null, v);
    return Promise.resolve(v);
  },
  setItem: function (key, value, cb) {
    store[key] = String(value);
    if (cb) cb(null);
    return Promise.resolve(null);
  },
  removeItem: function (key, cb) {
    delete store[key];
    if (cb) cb(null);
    return Promise.resolve(null);
  },
  clear: function (cb) {
    store = {};
    if (cb) cb(null);
    return Promise.resolve(null);
  },
  getAllKeys: function (cb) {
    var keys = Object.keys(store);
    if (cb) cb(null, keys);
    return Promise.resolve(keys);
  },
  multiGet: function (keys, cb) {
    var result = keys.map(function (k) { return [k, store[k] != null ? store[k] : null]; });
    if (cb) cb(null, result);
    return Promise.resolve(result);
  },
  multiSet: function (pairs, cb) {
    pairs.forEach(function (p) { store[p[0]] = String(p[1]); });
    if (cb) cb(null);
    return Promise.resolve(null);
  },
  multiRemove: function (keys, cb) {
    keys.forEach(function (k) { delete store[k]; });
    if (cb) cb(null);
    return Promise.resolve(null);
  },
};
module.exports = AsyncStorage;
module.exports.default = AsyncStorage;
