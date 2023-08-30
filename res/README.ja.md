<div align="center">
<img src="https://raw.githubusercontent.com/wowsinfo/react-native-app/master/wowsinfo/ios/wowsinfo/support/Assets.xcassets/AppIcon.appiconset/AppIcon.png" width="128px" height="128px" />
<h1>WoWs Info セブン</h1>
</div>

このアプリは、World of Warshipsの公式アプリではありません。これはReact Nativeで開発された個人プロジェクトで、iOSとAndroidの両方に対応しています（作業中）。このアプリは[Wargaming API](https://developers.wargaming.net)、[WoWs Numbers](http://wows-numbers.com)、および[Global Wiki](https://wiki.wargaming.net/en/World_of_Warships)からデータを取得します。

# プロジェクトの実行
- [React Nativeのセットアップ](https://reactnative.dev/docs/environment-setup?guide=native)
- Xcodeのダウンロード
- `cocoapods`と`fastlane`に必要なRubyをセットアップ
- リポジトリをクローン
- `npx yarn`コマンドでノードパッケージをインストール
- cocoapodsの依存関係をインストール
- `npx yarn ios`コマンドでiOSアプリを実行

## APIキーの取得
[Wargaming Developer](https://developers.wargaming.net/)から、新しいアプリやウェブサイトを登録し、それを`wowsinfo/src/value/key.js`に配置してください。
```
export const AppKey = '<あなたのキー>';
```

お気軽にアプリをデバイスで実行してみてください。有料機能にアクセスするためにソースコードを変更していただいても構いませんが、適切なライセンスなしに他人と共有しないようお願いします。

WoWs Info セブンはメンテナンスに重点を置き、多くの新機能は導入しません。すでに実装されている機能を基にしています。新しいバージョンがあるかどうかは未定です。

これはChatGPTによって言語化されました。
