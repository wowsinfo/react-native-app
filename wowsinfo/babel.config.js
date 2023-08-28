module.exports = function(api) {
  api.cache(true); // necessary
  if (process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production') {
    // remove console.* in production
    return {
      presets: ["module:metro-react-native-babel-preset"],
      plugins: ["react-native-paper/babel", "transform-remove-console"]
    }
  } else {
    return {
      presets: ["module:metro-react-native-babel-preset"],
    }
  }
}
