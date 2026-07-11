module.exports = {
  root: true,
  extends: '@react-native',
  // error on undefined variables and undeclared variables
  rules: {
    'no-undef': 0,
    'no-unused-vars': 0,
    'react-native/no-inline-styles': 0,
    eqeqeq: 0,
    'react/react-in-jsx-scope': 0,
    'no-shadow': 0,
  },
};
