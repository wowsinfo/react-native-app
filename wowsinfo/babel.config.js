module.exports = function (api) {
  api.cache(true); // necessary
  const presets = ['module:metro-react-native-babel-preset'];

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.BABEL_ENV === 'production'
  ) {
    // remove console.* in production
    return {
      presets,
      plugins: ['react-native-paper/babel', 'transform-remove-console'],
    };
  } else {
    return {
      presets,
    };
  }
};
