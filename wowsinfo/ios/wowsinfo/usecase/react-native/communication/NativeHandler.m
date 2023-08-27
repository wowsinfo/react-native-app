//
//  NativeHandler.m
//  wowsinfo
//
//  Created by Yiheng Quan on 27/8/2023.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeHandler, NSObject)

RCT_EXTERN_METHOD(saveMainAccountInfo:(NSString *)json)

@end
