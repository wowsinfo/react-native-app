import {Linking, NativeModules, Platform} from 'react-native';
const handler = NativeModules.SimpleViewHandler as
  | SimpleViewHandlerInterface
  | undefined;

export class SimpleViewHandler {
  static async openURL(url: string) {
    if (Platform.OS === 'ios' && handler?.showSafariViewController) {
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
