# Communication with React Native
This is very important working with React Native alongside Swift. The app needs to have a very good way of communication between Swift & React Native. This is the response from Bing on how to achieve this.

***

To achieve two-way communication between React Native and Swift, you can use the `RCTBridge` class provided by React Native. The `RCTBridge` class is a bridge between the JavaScript runtime and the native code. It allows you to call native code from JavaScript and vice versa.

Here is an example of how to call a Swift function from React Native and receive the result as a promise:

```swift
@objc(MySwiftModule)
class MySwiftModule: NSObject {
    // @objc mark must be used here
    @objc func myFunction(_ input: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        // Perform some operation with input
        let output = "Hello, " + input + "!"
        // Return the output as a promise
        resolve(output)
    }
}
```

In this example, we define a Swift class `MySwiftModule` with a function `myFunction` that takes an input string and returns a promise. The `resolve` block is called when the operation is successful, and the `reject` block is called when there is an error.

To call this function from React Native, you need to create a module that exposes this function to JavaScript. Here is an example of how to do that:

```objc
// MySwiftModule.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MySwiftModule, NSObject)

// This must match exactly with the Swift function's signature
RCT_EXTERN_METHOD(myFunction:(NSString *)input resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
```

In this example, we define an Objective-C module `MySwiftModule` that exposes the `myFunction` method to JavaScript. ***It is recommened to ask ChatGPT to convert Swift to Objective-C function signature***. Simply ask `convert @objc func xxx to Objective-C function signature`.

To call this function from JavaScript, you can use the `NativeModules` module provided by React Native. Here is an example of how to do that:

```javascript
import { NativeModules } from 'react-native';

const MySwiftModule = NativeModules.MySwiftModule;

MySwiftModule.myFunction('world')
  .then(output => console.log(output))
  .catch(error => console.error(error));
```

In this example, we import the `NativeModules` module and get a reference to our Swift module `MySwiftModule`. We then call the `myFunction` method with an input of `'world'`. The result is returned as a promise, which we handle using `.then()` and `.catch()`.

To call a React Native function from Swift and receive the result as async, you can use the `RCTEventEmitter` class provided by React Native. The `RCTEventEmitter` class allows you to emit events from native code to JavaScript.

Here is an example of how to emit an event from Swift:

```swift
@objc(MySwiftModule)
class MySwiftModule: RCTEventEmitter {
  override func supportedEvents() -> [String]! {
    return ["myEvent"]
  }

  @objc func myFunction(_ input: String) -> Void {
    // Perform some operation with input
    let output = "Hello, " + input + "!"
    // Emit an event with the output
    sendEvent(withName: "myEvent", body: ["output": output])
  }
}
```

In this example, we define a Swift class `MySwiftModule` that extends `RCTEventEmitter`. We override the `supportedEvents()` method to specify which events we want to emit. We then define a function `myFunction` that takes an input string and emits an event with the output.

To listen for this event in React Native, you can use the `DeviceEventEmitter` module provided by React Native. Here is an example of how to do that:

```javascript
import { DeviceEventEmitter } from 'react-native';

DeviceEventEmitter.addListener('myEvent', event => console.log(event.output));
```

In this example, we import the `DeviceEventEmitter` module and add a listener for the `'myEvent'` event. When the event is emitted from Swift, we log the output to the console.

I hope this helps!

Source: Conversation with Bing, 27/08/2023
- Communication between native and React Native · React Native. https://reactnative.dev/docs/communication-ios.
- Comparing the Performance between Native iOS (Swift) and React-Native .... https://medium.com/the-react-native-log/comparing-the-performance-between-native-ios-swift-and-react-native-7b5490d363e2.
- How to use Swift in your React Native app - DEV Community. https://dev.to/akinncar/how-to-use-swift-in-your-react-native-app-46mj.
