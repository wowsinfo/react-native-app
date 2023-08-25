/**
 * Receive calls from native
 */

import { NativeEventEmitter, NativeModules } from 'react-native';
const eventEmitter = NativeModules.ReactNativeCaller;

class NativeReceiver {
    constructor() {
        const emitter = new NativeEventEmitter(eventEmitter);
        emitter.addListener('data_loading', (type: string) => {
            this.data_loading();
        });
    }

    private data_loading(): void {
        //
    }
}
