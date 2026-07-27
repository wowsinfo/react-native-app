// @ts-nocheck
var React = require('react');
var RN = require('react-native');

var iconMap = {
  'check': '\u2713',
  'home': '\u2302',
  'search': '\u2315',
  'cog': '\u2699',
  'arrow-left': '\u2190',
  'close': '\u2715',
  'menu': '\u2630',
  'star': '\u2605',
  'heart': '\u2665',
  'info': '\u24D8',
  'warning': '\u26A0',
  'settings': '\u2699',
  'chevron-left': '\u2039',
  'chevron-right': '\u203A',
  'chevron-down': '\u2304',
  'chevron-up': '\u2303',
};

function Icon(props) {
  var ch = iconMap[props.name] || '?';
  return React.createElement(RN.Text, {
    style: [{ fontSize: props.size || 24, color: props.color || '#000', textAlign: 'center' }, props.style]
  }, ch);
}

Icon.Button = function(props) {
  return React.createElement(RN.TouchableOpacity, {
    onPress: props.onPress,
    style: { flexDirection: 'row', alignItems: 'center', padding: 8 }
  }, React.createElement(Icon, { name: props.name, size: props.size, color: props.color }), React.createElement(RN.Text, { style: { marginLeft: 4 } }, props.children));
};

Icon.TabBarItem = function() { return null; };
Icon.TabBarItemIOS = function() { return null; };
Icon.getImageSource = function() { return Promise.resolve(null); };
Icon.loadFont = function() { return Promise.resolve(); };
Icon.hasIcon = function() { return true; };
Icon.getRawGlyphMap = function() { return iconMap; };

module.exports = Icon;
module.exports.default = Icon;
