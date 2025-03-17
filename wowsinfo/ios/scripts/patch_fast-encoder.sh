# dump this script into ../node_modules/react-native-fast-encoder/ios/FastEncoderModule.h
# run from ios directory, not ios/scripts

echo "#ifdef __cplusplus
#import \"react-native-fast-encoder.h\"
#endif

#import <React/RCTBridgeModule.h>

@interface FastEncoderModule : NSObject <RCTBridgeModule>
@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end" > ../node_modules/react-native-fast-encoder/ios/FastEncoderModule.h
