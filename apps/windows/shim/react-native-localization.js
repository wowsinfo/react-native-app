var ReactLocalization = require('react-localization');
function getInterfaceLanguage() {
  return 'en-US';
}
function LocalizedStrings(props) {
  return new (ReactLocalization.default || ReactLocalization)(props, { customLanguageInterface: getInterfaceLanguage });
}
LocalizedStrings.prototype = (ReactLocalization.default || ReactLocalization).prototype;
LocalizedStrings.prototype.constructor = LocalizedStrings;
module.exports = LocalizedStrings;
module.exports.default = LocalizedStrings;
