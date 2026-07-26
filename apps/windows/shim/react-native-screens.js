var React = require('react');
var RN = require('react-native');

function View(props) { return React.createElement(RN.View, props, props.children); }
var ScreenContext = React.createContext(null);

exports.Screen = View;
exports.InnerScreen = View;
exports.ScreenContainer = View;
exports.ScreenStack = View;
exports.ScreenStackItem = View;
exports.ScreenContentWrapper = View;
exports.ScreenFooter = View;
exports.FullWindowOverlay = View;
exports.ScreenContext = ScreenContext;
exports.ScreenStackHeaderConfig = function() { return null; };
exports.ScreenStackHeaderSubview = function() { return null; };
exports.ScreenStackHeaderLeftView = function() { return null; };
exports.ScreenStackHeaderCenterView = function() { return null; };
exports.ScreenStackHeaderRightView = function() { return null; };
exports.ScreenStackHeaderBackButtonImage = function() { return null; };
exports.ScreenStackHeaderSearchBarView = function() { return null; };
exports.SearchBar = function() { return null; };
exports.isSearchBarAvailableForCurrentPlatform = false;
exports.executeNativeBackPress = function() { return false; };
exports.enableScreens = function() {};
exports.enableFreeze = function() {};
exports.screensEnabled = function() { return false; };
exports.freezeEnabled = function() { return false; };
exports.compatibilityFlags = {};
exports.featureFlags = {};
exports.useTransitionProgress = function() { return {progress: 0, closing: 0, goingForward: 0}; };
exports.default = View;
