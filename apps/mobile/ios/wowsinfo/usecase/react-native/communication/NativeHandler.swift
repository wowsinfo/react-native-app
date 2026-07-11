//
//  NativeHandler.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 27/8/2023.
//

import React

/// Handles all not UI related requests from React Native
@objc(NativeHandler)
class NativeHandler: NSObject, RCTBridgeModule {
    
    @objc func saveMainAccountInfo(_ json: String) {
        // TODO: to be implemented
    }
    
    static func moduleName() -> String! {
        "NativeHandler"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        false
    }
}
