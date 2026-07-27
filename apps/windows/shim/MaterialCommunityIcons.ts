// @ts-nocheck
var React = require('react');
var RN = require('react-native');

var iconMap = {
  'check': '\u2713',
  'home': '\u2302',
  'cog': '\u2699',
  'arrow-left': '\u2190',
  'search': '\u2315',
  'close': '\u2715',
  'menu': '\u2630',
  'star': '\u2605',
  'heart': '\u2665',
  'information': '\u24D8',
  'alert': '\u26A0',
  'chevron-left': '\u2039',
  'chevron-right': '\u203A',
  'chevron-down': '\u2304',
  'chevron-up': '\u2303',
  'plus': '\u002B',
  'minus': '\u2212',
  'delete': '\u2716',
  'settings': '\u2699',
  'refresh': '\u21BB',
};

function MaterialCommunityIcons(props) {
  var ch = iconMap[props.name] || '\u25CF';
  return React.createElement(RN.Text, {
    style: [{ fontSize: props.size || 24, color: props.color || '#000', textAlign: 'center' }, props.style]
  }, ch);
}

MaterialCommunityIcons.getImageSource = function() { return Promise.resolve(null); };
MaterialCommunityIcons.loadFont = function() { return Promise.resolve(); };
MaterialCommunityIcons.hasIcon = function() { return true; };
MaterialCommunityIcons.getRawGlyphMap = function() { return iconMap; };

module.exports = MaterialCommunityIcons;
module.exports.default = MaterialCommunityIcons;
