import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform, Share } from 'react-native';

type BrowserNavigator = {
  share?(data: { title?: string; text?: string; url?: string }): Promise<void>;
  clipboard?: {
    writeText(text: string): Promise<void>;
  };
};

export async function openUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  await WebBrowser.openBrowserAsync(url);
}

export async function shareUrl(message: string, url: string) {
  if (Platform.OS === 'web') {
    const browserNavigator =
      typeof window !== 'undefined'
        ? (globalThis.navigator as BrowserNavigator | undefined)
        : undefined;

    if (browserNavigator?.share) {
      await browserNavigator.share({ title: message, text: message, url });
      return;
    }

    const clipboard = browserNavigator?.clipboard;
    if (clipboard?.writeText) {
      await clipboard.writeText(`${message}\n${url}`);
      Alert.alert('Link copied', 'The app link was copied to your clipboard.');
      return;
    }

    await openUrl(url);
    return;
  }

  await Share.share({
    message: `${message}\n${url}`,
    url,
  });
}
