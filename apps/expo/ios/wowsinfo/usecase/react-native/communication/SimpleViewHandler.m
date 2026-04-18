//
//  SimpleViewHandler.m
//  wowsinfo
//
//  Created by Yiheng Quan on 27/8/2023.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SimpleViewHandler, NSObject)

/// Must match the Objective-C name with the swift name
/// The Swift function must be marked as @objc
RCT_EXTERN_METHOD(showSafariViewController:(NSString *)link
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
