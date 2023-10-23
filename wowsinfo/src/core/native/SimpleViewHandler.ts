import {Linking, NativeModules, Platform} from 'react-native';
const handler: SimpleViewHandlerInterface = NativeModules.SimpleViewHandler;

export class SimpleViewHandler {
  static async openURL(url: string) {
    if (Platform.OS === 'ios') {
      const success = await handler.showSafariViewController(url);
      console.log('SimpleViewHandler.openURL', success);
      if (success) {
        return;
      }
    }

    this.openExternalURL(url);
  }

  static async openExternalURL(url: string) {
    Linking.openURL(url);
  }
}

interface SimpleViewHandlerInterface {
  showSafariViewController(url: string): Promise<boolean>;
}
