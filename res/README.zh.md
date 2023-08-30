<div align="center">
<img src="https://raw.githubusercontent.com/wowsinfo/react-native-app/master/wowsinfo/ios/wowsinfo/support/Assets.xcassets/AppIcon.appiconset/AppIcon.png" width="128px" height="128px" />
<h1>WoWs Info 赛文</h1>
</div>

此应用并非是《战舰世界》的官方应用。它是一个由 React Native 驱动的个人项目，支持 iOS 和 Android（很快）。该应用从 [Wargaming API](https://developers.wargaming.net)、[WoWs Numbers](http://wows-numbers.com) 以及 [Global Wiki](https://wiki.wargaming.net/en/World_of_Warships) 获取数据。


# 运行项目
- 配置[React Native](https://reactnative.dev/docs/environment-setup?guide=native)
- 下载Xcode
- 设置Ruby以支持`cocoapods`和`fastlane`
- 克隆GitHub仓库
- 使用`npx yarn`安装所需的node依赖
- 安装cocoapods依赖
- 运行iOS应用，使用命令`npx yarn ios`

## 获取API密钥
从[Wargaming Developer](https://developers.wargaming.net/)注册您的新应用程序或网站，并将其放置在`wowsinfo/src/value/key.js`中。
```
export const AppKey = '<您的密钥>';
```
之后，您可以在设备上运行该应用。您可以修改源代码以使用所有付费功能。但是，请不要在没有适当许可的情况下将其分享给他人。

WoWs Info 赛文将专注于维护工作，不会引入许多新功能。它将在已经实现的功能的基础上进行更新。之後可能会有新版本，也可能没有。

这是由ChatGPT进行语言本地化的。
