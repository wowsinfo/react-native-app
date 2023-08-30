<div align="center">
<img src="https://raw.githubusercontent.com/wowsinfo/react-native-app/master/wowsinfo/ios/wowsinfo/support/Assets.xcassets/AppIcon.appiconset/AppIcon.png" width="128px" height="128px" />
<h1>WoWs Info Seven</h1>
</div>

<!-- [中文](https://github.com/HenryQuan/WoWs-Info-Re/blob/master/README_zh.md) | [English](https://github.com/HenryQuan/WoWs-Info-Re/blob/master/README.md) | [日本語](https://github.com/HenryQuan/WoWs-Info-Re/blob/master/README_ja.md) -->

This app is not the official app for World of Warships. It is a personal project that is powered by React Native and supports both iOS and Android (work in progress). The app retrieves data from [Wargaming API](https://developers.wargaming.net), [WoWs Numbers](http://wows-numbers.com), and [Global Wiki](https://wiki.wargaming.net/en/World_of_Warships).

# Running the project
- Setup [React Native](https://reactnative.dev/docs/environment-setup?guide=native)
- Download Xcode
- Setup Ruby for `cocoapods` and `fastlane`
- Clone the repository
- Install node packages with `npx yarn`
- Install cocoapods dependencies
- Run the iOS app with `npx yarn ios`

## Obtaining the API key
From [Wargaming Developer](https://developers.wargaming.net/), register your new app or website to and place it under `wowsinfo/src/value/key.js`.
```
export const AppKey = '<Your Key>';
```

Feel free to run the app on your device. You are welcome to modify the source code to access all the paid features. However, please refrain from distributing it to others without the appropriate licence.

WoWs Info Seven will be focusing on maintainance and won't introduce many new features. It will be building upon what has already been implemented. There may be a new version or not. 