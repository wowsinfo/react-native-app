/**
 * Receive native events for communication with native code
 */
import {NativeEventEmitter, NativeModules} from 'react-native';
const eventEmitter = NativeModules.ReactNativeEvent;

export class NativeEvents {
  constructor() {
    const emitter = new NativeEventEmitter(eventEmitter);
    emitter.addListener('dummy', (type: string) => {
      this.data_loading();
      console.log('dummy event received from native', type);
    });
  }

  private data_loading(): void {}
}
